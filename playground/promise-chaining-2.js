require('../src/db/mongoose')
const Task = require('../src/models/task')

// Task.findByIdAndDelete('5ed180a3f969a14137d85d12').then((task) => {
//   console.log(task)
//   return Task.countDocuments({completed: false})
// }).then((result) => {
//   console.log(result)
// }).catch((e) => {
//   console.log(e)
// })

// 5ed1621bb0c939408577e4be
const deleteTaskAndCount = async (id) => {
  const task = await Task.findByIdAndDelete(id)
  const count = await Task.countDocuments({completed: false})
  return count
}

deleteTaskAndCount('5ed1621bb0c939408577e4be').then((count) => {
  console.log(count)
}).catch((e) => {
  console.log(e)
})