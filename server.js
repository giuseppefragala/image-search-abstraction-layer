var express = require('express');
var app = express();
var path = require('path');
var request = require('request');

app.set('views', __dirname + '/');

app.get('/', function(req, res) {
      res.sendFile(path.join(__dirname + '/index.htm'));
});
var searchString

app.get('/api/imagesearch/:searchString', function(req, res, next) {
  searchString = req.params.searchString;
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



app.listen(process.env.PORT || 3000)
console.log("Server is listening you!");