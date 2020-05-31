const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()

const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})
// const multer = require('multer')
// const upload = multer({
//   dest: 'images',
//   limits: {
//     // size in bytes
//     fileSize: 1000000
//   },
//   // restrict file-type
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(doc|docx)$/)) {
//       return cb(new Error('Please upload a Word document'))
//     }
//     cb(undefined, true)
//     // cb(new Error('File must be a PDF'))
//     // cb(undefined, true)
//     // cb(undefined, false)
//   }
// })

// const errorMiddleware = (req, res, next) => {
//   throw new Error('From my middleware')
// }

// app.post('/upload', upload.single('upload'), (req, res) => {
//   res.send()
// }, (error, req, res, next) => {
//   // Error handler
//   res.status(400).send({error: error.message})
// })

// Maintenance middleware
// app.use((req, res, next) => {
//   res.status(503).send('Site is currently down. Check back soon!')
// })

// automatically parse incoming json to object
