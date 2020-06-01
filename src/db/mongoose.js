const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
})

// const me = new User({
//   name: '  Andrew',
//   email: ' MYEMAIL@ME.IO  ',
//   password: 'phone098!'
// })

// me.save().then(() => {
//   console.log(me)
// }).catch((error) => {
//   console.log('Error!', error)
// })

// const task = new Task({
//   description: ' Eat lunch',
//   completed: false
// })

// task.save().then(() => {
//   console.log(task)
// }).catch((error) => {
//   console.log('Error!', error)
// })

