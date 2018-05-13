// var MongoClient = require('mongodb').MongoClient
//   , Server = require('mongodb').Server;

// var mongoClient = new MongoClient(new Server('127.0.0.1', 27017));
// mongoClient.connect(function(err, db) {
//     if(err) {
//         console.error(err);
//         return;
//     }
//   let _db = db.db('mytest')
//     _db.createCollection('a').then(res=>{
//         db.close();
//     })
// });


const mongodb = require('mongodb')

//var MongoClient = require('mongodb').MongoClient;
const ObjectID = mongodb.ObjectID
const MongoClient = mongodb.MongoClient;
const url = "mongodb://llk:llk2017@localhost:27017/llk?authMechanism=DEFAULT";

MongoClient.connect(url, { useNewUrlParser: true },function(err, db) {
  if (err) throw err;
  let dbo = db.db("llk");

  dbo.createCollection("ssst", function(err, res) {
    if (err) throw err;
    db.close()
    console.log("db connected");
  });

});

