'use strict';

var mongoose = require('mongoose');
var SearchQuery = require('../models/searchQuery.js');

function fetchQueries(req, res) {
  var fetchQuery = SearchQuery.find({ },
                                    { '_id': 0, '__v': 0 }).
                                    sort({ when: -1 }).limit(10).exec();

  fetchQuery.then(function(queries) {
      res.json(queries);
  })
  .catch(function(err){
    res.json({'error': err.message});
  });
}

module.exports = fetchQueries;
