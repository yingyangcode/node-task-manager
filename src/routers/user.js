const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = express.Router()


router.post('/users', async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
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

module.exports = router