'use strict';

var express = require('express');
var mongoose = require('mongoose');
var router = require('./app/routes');

var app = express();

/* load the environment variables into process.env (not in production)*/
require('./set-env')(app);

var mongoURI = process.env.DB_URI;

mongoose.connect(mongoURI, function(err, res) {
  if(err) {
    console.log('Error connecting to the database. ' + err);
  } else {
    console.log('Connected to Database!');
  }
});

/** Serve static content in folder public/ */
app.use(express.static('public'));
app.use(router);

if(app.settings.env !== 'test'){
  app.listen(process.env.PORT, function() {
    var port = process.env.PORT;
    console.log('Server listening on port %s!', port);
  });
}

module.exports = app;
