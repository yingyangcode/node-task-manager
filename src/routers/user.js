const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')
const router = express.Router()


router.post('/users', async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    sendWelcomeEmail(user.email, user.name)
    const token = await user.generateAuthToken()
    res.status(201).send({user, token})
  } catch (e) {
    res.status(400).send(e)
  }
  // user.save().then(() => {
  //   res.status(201).send(user)
  // }).catch((e) => {
  //   res.status(400).send(e)
  // })
})

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token  = await user.generateAuthToken()
    res.send({user, token})
  } catch (e) {
    res.status(400).send()
  }
})

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

router.post('/users/logoutall', auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send() 
  }
})
// router.get('/users/', auth, async (req, res) => {
//   try {
//     const users = await User.find({})
//     res.send(users)
//   } catch (e) {
//     res.status(500).send()
//   }
//   // User.find({}).then((users) => {
//   //   res.send(users)
//   // }).catch((e) => {
//   //   res.status(500).send()
//   // })
// })

router.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
})

// router.get('/users/:id', async (req, res) => {
//   const _id = req.params.id

//   if (_id.length != 24) {
//     res.status(404).send()
//   } else {
//     try {
//       const user = await User.findById(_id)
//       if (!user) {
//         return res.status(404).send()
//       }
//       res.send(user)
//     } catch (e) {
//       res.status(500).send()
//     }
//   }
//   // if (_id.length != 24) {
//   //   res.status(404).send()
//   // } else {
//   //   User.findById(_id).then((user) => {
//   //     if (!user) {
//   //       return res.status(404).send()
//   //     }
//   //     res.send(user)
//   //   }).catch((e) => {
//   //     res.status(500).send()
//   //   })
//   // }
// })

// router.patch('/users/:id', async (req, res) allow users to update only their own profiles
router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age']
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update)
  })

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!'})
  }

  try {
    updates.forEach((update) => req.user[update] = req.body[update])
    await req.user.save()
    res.send(req.user)
  } catch (e) {
    res.status(400).send(e)
  }

  // const _id = req.params.id
  // if(_id.length != 24) {
  //   res.status(404).send()
  // } else {
  //   try {
  //     const user = await User.findById(req.params.id)
  //     updates.forEach((update) => {
  //       user[update] = req.body[update]
  //     })
  //     await user.save()
  //     // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  //     if (!user) {
  //       return res.status(404).send()
  //     }
  //     res.send(user)
  //   } catch (e) {
  //     res.status(400).send(e)
  //   }
  // }
})
// router.delete('/users/:id) only allow user to delete personal profile
router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove()
    sendCancelationEmail(req.user.email, req.user.name)
    res.send(req.user)
  } catch (e) {
    res.status(500).send()
  }
  // const _id = req.params.id
  // if(_id.length != 24) {
  //   res.status(404).send()
  // } else {
  //   try {
  //     // const user = await User.findByIdAndDelete(req.params.id)
  //     // since we have auth middleware
  //     // we have user obj on the req
  //     // const user = await User.findByIdAndDelete(req.user._id)
  //     // if (!user) {
  //     //   return res.status(404).send()
  //     // }
  //     // there is no reason to check if there is a user
  //     // with that id since we just fetched 
  //     // the user from the database when authenticating
  //     res.send(user)
  //   } catch (e) {
  //     res.status(500).send(e)
  //   }
  // } 
})

const upload = multer({
  // removing dest means multer will not save data in the 
  // file system folder destination
  // instead it will pass that data through to the function below
  // dest: 'avatars',
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image'))
    }
    cb(undefined, true)
  }
})


router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  // sharp gives the value we set on req.user.avatar
  const buffer = await sharp(req.file.buffer).resize({ width: 250, height:250 }).png().toBuffer()
  req.user.avatar = buffer
  await req.user.save()
  res.send()
}, (error, req, res, next) => {
  res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async (req, res) => {
  req.user.avatar = undefined
  await req.user.save()
  res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user || !user.avatar) {
      throw new Error()
    }
    // above we made sure to only send png with sharp
    // So we know the content-type is image/png
    res.set('Content-Type', 'image/png') 
    res.send(user.avatar)    

  } catch (e) {
    res.status(404).send()
  }
})

module.exports = router