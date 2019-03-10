var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb1");
  // Perform a simple find and return all the documents
  dbo.collection("users").find().toArray(function(err, result){
    if (err) throw err;
    console.log(result);
    db.close();
  });
});