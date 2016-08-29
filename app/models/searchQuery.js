'use strict';

var mongoose = require('mongoose');
// set Promise provider to bluebird
mongoose.Promise = require('bluebird');

var Schema = mongoose.Schema;

var querySchema = new Schema({
  term: {
    type: String,
    required: true
  },
  when: {
    type: Date,
    required: true
  }
}/*, { capped: 1048576})*/; /* Limit space to a max of 1 MB (in bytes). Commented because Mlab is blocking more than one capped collection in their Free service */

module.exports = mongoose.model('SearchQuery', querySchema, 'searchQuery');
