import { getRandomCode } from './util'
import mongodb from 'mongodb'
import { host } from './config'
//var MongoClient = require('mongodb').MongoClient;
const ObjectID = mongodb.ObjectID
const MongoClient = mongodb.MongoClient;
//const url = "mongodb://localhost:27017/llk";
const url = `mongodb://llk:llk2017@${host}:27017/llk?authMechanism=DEFAULT`;

function connect() {
  return new Promise((resolve, reject)=>{
    MongoClient.connect(url, function(err, db) {
      if (err) { reject(err) }
      resolve(db)
    });
  })
}

function exec(action) {
  let _db
  return connect().then(db => {
    _db = db
    return action.bind(null, _db.db('llk'))()
  }).then(result => {
    _db.close()
    return result
  }).catch(err => {
    _db.close()
    throw err
  })
}

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   let dbo = db.db("llk");

//   dbo.createCollection("users", function(err, res) {
//     if (err) throw err;
//     db.close()
//   });

//   console.log("Collection created!");
// });

/*
* init db  
*/
// let _db
// connect().then(db=>{
//   _db = db
//   return Promise.all([
//     db.createCollection('users'),
//     db.createCollection('courses')
//   ])
// }).then(()=>{
//   _db.close()
// }).catch(err=>{
//   _db.close()
//   throw err
// })

export const tables = {
  users: 'users',
  courses: 'courses',
  user_links: 'user_links'
}

exec(function(db){
  return Promise.all([
    db.createCollection(tables.users),
    db.createCollection(tables.courses),
    db.createCollection(tables.user_links)
  ])
})

//test()





// function action(n,t) {
//   return new Promise((res,rej)=>{
//     console.log(n)
//     if(t) {
//       setTimeout(()=>{
//         res()
//       },t)
//     }
//     else {
//       res()
//     }
//   })
// }

// function test() {
//   action('1').then(()=>{
//     return action('2')
//   }).then(()=>{
//     console.log(`promise.finally`,Promise.finally)
//   })
// }

export const addUser = (email, password) => exec(function (db) {
  return db.collection(tables.users).insertOne({
    email,
    password,
    active: false,
    registerDate: new Date().toISOString()
  })
})

export const findUser = (email) => exec(function(db) {
  console.log(`db find user`,email)
  return db.collection(tables.users).findOne({email})
})

export const saveUser = (query, user) => exec(function (db) {
  return new Promise((resolve, reject) => {
    db.collection(tables.users).updateOne(query, { $set: user }, function (err, res) {
      if (err) { reject(err) }
      resolve(res)
    })
  })
})

export const addUserLink = (email, type, data) => exec(function (db) {
  let code = getRandomCode(email)
  console.log(`code`,code)
  let document = {
    email,
    code,
    type,
    ...data,
    date: new Date().toISOString()
  }
  return db.collection(tables.user_links).insertOne(document).then(() => code)
})

export const getLink = (code) => exec(function(db){
  return db.collection(tables.user_links).findOne({
    code
  })
})

export const getCourse = (courseId, email) => exec(function(db){
  console.log(`db get course`,courseId,email)
  return db.collection(tables.courses).findOne({_id: new ObjectID(courseId), email})
})

export const getCourses = (email) => exec(function(db){
  console.log(`db getcourse`,)
  return new Promise((resolve,reject) => {
    db.collection(tables.courses).find({email}).toArray(function(err,res){
      console.log(`db getcourse res`,res)
      if(err) reject(err)
      resolve(res)
    })
  })
})

export const saveCourse = (courseId, email, courseName, words) => exec(function(db){
  console.log(`db saveCourse`,courseId)
  return new Promise((resolve,reject) => {
    let query = courseId ? { _id: new ObjectID(courseId), email } : { email, courseName }
    let update = { $set: { email, courseName, words }}
    db.collection(tables.courses)
      .updateOne(query, update, {upsert:true, w: 1}, function(err, result){
        if(err) { 
          console.error(err)
          reject(err) 
        }
        resolve(result)
      })
  })
})

// export function addUser(email, password) {
//   let _db
//   connect().then(db => {
//     _db = db
//     return _db.collection('users').insertOne({
//       email,
//       password,
//       registerDate: new Date().toISOString()
//     })
//   }).finally(() => {
//     _db.close()
//   })
// }

// export function findUser(email) {
//   let _db
//   connect().then(db=>{
//     _db = db
//     let user = _db.collection('users').find({email})
//     _db.close()
//     return user
//   })
// }