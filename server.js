var express = require('express');
var app = express();
var path = require('path');

app.set('views', __dirname + '/');

app.get('/', function(req, res) {
      res.sendFile(path.join(__dirname + '/index.htm'));
});


app.get('/api/imagesearch/:searchString', function(req, res) {
	var searchString = req.params.searchString;
  	res.send(searchString);
});


app.listen(process.env.PORT || 3000)
console.log("Server is listening you!");