var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb1");
  var myobj = { 
        name: "Jonh Button", 
        birthday: "15/09/1993",
        gender: "male",
        account: "button",
        password: "hy12345",
        avatar: "",
        hometown: "Chicago - California - American",
        phone: "0964 191 282",
        location: "109099009-1202996",
        devices: [
            {
                id:"190929119905",
                name: "light of living room",
                status:"OFF",   
            },
            {
                id:"190929119906",
                name: "fan of living room",
                status:"OFF",   
            },
            ,
            {
                id:"190929119907",
                name: "fridge of living room",
                status:"ON",   
            }
        ]

    };
  dbo.collection("users").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});