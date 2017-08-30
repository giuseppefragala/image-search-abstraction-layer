var express = require('express');
var app = express();
var path = require('path');
var request = require('request');
var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var connUrl = process.env.MONGODB_URI;

app.set('views', __dirname + '/');

app.get('/', function(req, res) {
      res.sendFile(path.join(__dirname + '/index.htm'));
});
var searchString;
var sysdate;
app.get('/api/imagesearch/:searchString', function(req, res, next) {
  searchString = req.params.searchString;
  sysdate=new Date().toISOString();
  var arr = []
  arr.push({term:searchString, when: sysdate})
  write((arr))
    next()
  //res.redirect('https://www.googleapis.com/customsearch/v1?q=' + searchString + '&cx=' + process.env.cx + '&key=' + process.env.key + '&searchType=image')

}, function (req, res) {
      request('https://www.googleapis.com/customsearch/v1?q=' + searchString + '&cx=' + process.env.cx + '&key=' + process.env.key + '&searchType=image',function(err,result,body) {
      var images = [];
          var data = JSON.parse(body);
          data.items.forEach(function(val) {
            var obj = {
              image: val.link,
              text: val.snippet,
              source: val.link
            }
            images.push(obj);
          })
          res.send(images);
      })  
  
  });


app.get('/api/latest/imagesearch/', function(req, res, next) {
    //res.send(read())
  console.log(read(res))
  //res.end()
  });

app.listen(process.env.PORT || 3000)
console.log("Server is listening you!");

function write (object){
// --------- INSERT A SINGLE DOCUMENT OR AN ARRAY OF DOCUMENT INTO A COLLECTION -------------------------------------------------
MongoClient.connect(connUrl,function (err, db) {
if(err) return err;
  // Get the documents collection
  var collection = db.collection('imagesearch');
  // Insert the documents
  collection.insert(object, function (err, result) {
  db.close();
  });
});
// --------- INSERT A SINGLE DOCUMENT OR AN ARRAY OF DOCUMENT INTO A COLLECTION --------------------------------------------------

};



var findDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('imagesearch');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  });
}


function read(response){
MongoClient.connect(connUrl,function (err, db) {
  if(err) return err;
    // Get the documents collection
    var collection = db.collection('imagesearch');
    var res;
    // Perform a simple find and return all the documents
    collection.find({},{_id:0}).toArray(function(err, docs) { 
        res = JSON.stringify(docs);
        response.send(res)
        db.close();
    });
});

};