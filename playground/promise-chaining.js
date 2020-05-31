require('../src/db/mongoose')
const User = require('../src/models/user')

// 5ed164e61bb69c40b6f92f94

// User.findByIdAndUpdate('5ed18628daa72e42bc417af1', {age: 1}).then((user) => {
//   console.log(user)
//   return User.countDocuments({age: 1})
// }).then((result) => {
//   console.log(result)
// }).catch((e) => {
//   console.log(e)
// })

const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, {age})
  const count = await User.countDocuments({age})
  return count
}

updateAgeAndCount('5ed164e61bb69c40b6f92f94', 2).then((count) => {
  console.log(count)
}).catch((e) => {
  console.log(e)
})
