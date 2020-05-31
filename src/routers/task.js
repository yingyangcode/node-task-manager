const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')

const router = express.Router()

// Fetching all tasks will get slow 
// Provide options to fetch only whats needed
// Filtering
  // GET /tasks?completed=True
// Pagination - 
  // GET /tasks?limit=10
  // GET /tasks?limit=10&skip=10
// Sorting
  // GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
  const match = {}
  const sort = {}
  if (req.query.completed) {
    // req.query.completed is a string, we need to convert it to a boolean
    match.completed = req.query.completed === 'true'
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc'? -1 : 1
  }
  try {
    // const tasks = await Task.find({})
    // await req.user.populate('tasks').execPopulate()
    await req.user.populate({
      path: 'tasks',
      match,
      // match: {
      //   completed: true
      // }
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort // 1 ascending, -1 descending
      }
    }).execPopulate()
    res.send(req.user.tasks)
  } catch (e) {
    res.status(500).send()
  }

  // Task.find({}).then((tasks) => {
  //   res.send(tasks)
  // }).catch((e) => {
  //   res.status(500).send()
  // })
})

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id

  if (_id.length != 24) {
    res.status(404).send()
  } else {
    try {
      // const task = await Task.findById(_id)
      // Make sure user can fetch only the task that they own
      const task = await Task.findOne({ _id, owner: req.user._id })

      if(!task) {
        return res.status(404).send()
      }

      res.send(task)
    } catch (e) {
      res.status(500).send()
    }
  }
  // if (_id.length != 24) {
  //   res.status(404).send()
  // } else {
  //   Task.findById(_id).then((task) => {
  //     if(!task) {
  //       return res.status(404).send()
  //     }
  //     res.send(task)
  //   }).catch((e) => {
  //     console.log(e)
  //     res.status(500).send()
  //   })
  // }
})

// router.post('/tasks', async (req, res) => {
//   const task = new Task(req.body)
//   try {
//     await task.save()
//     res.status(201).send(task)
//   } catch (e) {
//     res.status(400).send(e)
//   }
//   // task.save().then(() => {
//   //   res.status(201).send(task)
//   // }).catch((e) => {
//   //   res.status(400).send(e)
//   // })
// })

router.post('/tasks', auth, async (req, res) => {
  // const task = new Task(req.body)
  const task = new Task({
    ...req.body,
    owner: req.user._id
  })
  try {
    await task.save()
    res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
  // task.save().then(() => {
  //   res.status(201).send(task)
  // }).catch((e) => {
  //   res.status(400).send(e)
  // })
})



router.patch('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
  
  if (!isValidOperation) {
    return res.status(400).send({error: 'Invalid updates!'})
  }
  
  if (_id.length != 24) {
    res.status(404).send()
  } else {
    try {
      //const task = await Task.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true})
      // const task = await Task.findById(req.params.id)
      const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
      if(!task) {
        return res.status(404).send()
      }
      updates.forEach((update) => task[update] = req.body[update])
      await task.save()
      res.send(task)
    } catch (e) {
      res.status(400).send(e)
    }
  }
})

router.delete('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id
  if(_id.length != 24) {
    res.status(404).send()
  } else {
    try {
      //const task = await Task.findByIdAndDelete(req.params.id)
      const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
      if (!task) {
        return res.status(404).send()
      }
      res.send(task)
    } catch (e) {
      res.status(500).send(e)
    }
  } 
})

module.exports = router