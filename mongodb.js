// CRUD 
// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID

const { MongoClient, ObjectID } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

const id = new ObjectID()
console.log(id.id.length)
console.log(id.toHexString().length)
console.log(id.getTimestamp())

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
  if (error) {
    return console.log('Unable to connect to database')
  }

  const db = client.db(databaseName)
  
  // db.collection('users').insertOne({
  //   name:'Andrew',
  //   age:27
  // }).then((result) => {
  //   console.log(result)
  // }).catch((error) => {
  //   console.log(error)
  // })

  // db.collection('users').insertMany([
  //   {
  //     name:'Jen',
  //     age:28
  //   },
  //   {
  //     name: 'Gunther',
  //     age: 27
  //   }
  // ], (error, result) => {
  //   if(error) {
  //     return console.log('Unable to insert documents')
  //   }
  //   console.log(result.ops)
  // })

  // db.collection('users').findOne({_id: new ObjectID("5ed142d76a5c5e3f7a088114")}, (error, user) => {
  //   if (error) {
  //     return console.log('Unable to fetch')
  //   }
  //   console.log(user)
  // })

  // db.collection('users').find({age:28}).toArray((error, users) => {
  //   console.log(users);
  // })
  // db.collection('users').find({age:28}).count((error, count) => {
  //   console.log(count);
  // })

  // db.collection('users').updateOne({
  //   _id: new ObjectID("5ed142d76a5c5e3f7a088114")
  // }, {
  //   // $set: {
  //   //   name: 'Mike'
  //   // }
  //     $inc: {
  //       age:1
  //     }
  // }).then((result) => {
  //   console.log(result)
  // }).catch((error) => {
  //   console.log(error)
  // })

  // db.collection('tasks').findOne({_id: new ObjectID("5ed1410600c71e3f70192740")}, (error, task) => {
  //   console.log(task)
  // })

  // db.collection('users').deleteMany({
  //   age: 27
  // }).then((result) => {
  //   console.log(result)
  // }).catch((error) => {
  //   console.log(error)
  // })

  // db.collection('tasks').find({completed:false}).toArray((error, tasks) => {
  //   console.log(tasks)
  // })

  // db.collection('tasks').insertMany([
  //   {
  //     description: 'Clean the house',
  //     completed: true
  //   }, {
  //     description: 'Renew inspection',
  //     completed: false
  //   }, {
  //     description: 'Pot plants',
  //     completed: false
  //   }
  // ], (error, result) => {
  //   if(error) {
  //     return console.log('Unable to insert tasks!')
  //   }
  //   console.log(result.ops)
  // })

  // db.collection('tasks').updateMany({
  //   completed: false
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }).then((result) => {
  //   console.log(result.modifiedCount)
  // }).catch((error) => {
  //   console.log(error)
  // })

  db.collection('tasks').deleteOne({
    description : "Clean the house"
  }).then((result) => {
    console.log(result)
  }).catch((error) => {
    console.log(error)
  })


})