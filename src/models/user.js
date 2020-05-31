const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase:true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid')
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      if(value.toLowerCase().includes('password')) {
        throw new Error('Password cannot contain "password"')
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be a positive number')
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  avatar: {
    type: Buffer
  }
}, {
  timestamps: true
})
// userSchema.methods.getPublicProfile = function () {
//   const user = this
//   const userObject = user.toObject()

//   delete userObject.password
//   delete userObject.tokens

//   return userObject
// }

// a virtual attr is not data stored in database
// it is a relationship between two entities
userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id', // relationship btwn user's id on User and owner on Task 
  foreignField: 'owner' // name of the field on task
})
// res.send runs JSON.stringify on the object
// toJSON gets called when the object is stringified
// and it can send back a manipulated object to res.send
userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens
  // remove avatar data from profile response
  delete userObject.avatar

  return userObject
}

// methods are available on the instances (instance methods)
userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
  user.tokens = user.tokens.concat({ token })
  await user.save()
  
  return token
}

// static methods are available on the model (static methods)
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({email})
  if(!user) {
    throw new Error('Unable to login')
  }
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new Error('Unable to login')
  }
  return user
}
// Hash the plain text password before saving
userSchema.pre('save', async function(next) {
  const user = this

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

// Delete user tasks when user is removed
userSchema.pre('remove', async function(next) {
  const user = this
  await Task.deleteMany({ owner: user._id})
  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User