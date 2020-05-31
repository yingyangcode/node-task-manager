const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000


// Maintenance middleware
// app.use((req, res, next) => {
//   res.status(503).send('Site is currently down. Check back soon!')
// })

// automatically parse incoming json to object
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})
const Task = require('./models/task')
const User = require('./models/user')

// const main = async () => {
//   // const task = await Task.findById('5ed31221c7978e5c17209d2b')
//   // await task.populate('owner').execPopulate()
//   // console.log(task.owner)

//   const user = await User.findById('5ed309b88892485b2dd0be19')
//   await user.populate('tasks').execPopulate()
//   console.log(user.tasks)

// }

// main()