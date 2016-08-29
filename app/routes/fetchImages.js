'use strict';

var mongoose = require('mongoose');
var SearchQuery = require('../models/searchQuery.js');

/* Format the JSON Flickr returns, to fit the exercise requirements */
function formatPhotoData(photoData) {
  var info = {};
  info.imageURL = photoData.url_z;
  info.thumbnail = photoData.url_t;
  info.altText = photoData.title;
  /* Check https://www.flickr.com/services/api/misc.urls.html for URL doc */
  info.pageURL = 'https://www.flickr.com/photos/' + photoData.owner + '/' + photoData.id;
  info.ownerProfile = 'https://www.flickr.com/people/' + photoData.owner + '/';
  return info;
}
/*  */
function fetchImages(req, res) {
  var query = req.params.searchQuery;
  /* Real pagination here, not an offset: exercise is confusing and bad worded*/
  var offset = req.query.offset;

  var Flickr = require("flickrapi"),
    flickrOptions = {
      api_key: process.env.FLICKR_API_KEY,
      secret: process.env.FLICKR_API_SECRET,
      progress: false
    };

  Flickr.tokenOnly(flickrOptions, function(error, flickr) {
    // we can now use "flickr" as our API object,
    // but we can only call public methods and access public data
    flickr.photos.search({
      text: query, // search term
      // thumbnail, img uri and owner name
      extras: 'url_t, url_z, owner_name',
      // page of results to show
      page: (offset? offset: 1)
    }, function(err, result) {
      /*
       * if the request was succesful, format the data, register the search term
       * in the database and return the response
       */
      if (result.stat === 'ok') {
        var json = {};
        var search = new SearchQuery({
          term: query,
          when: Date()
        });
        // saveSearch is a promise
        var saveSearch = search.save();
        // if the search term is saved sucessfully, format the data
        saveSearch.then(function() {
          json = result.photos.photo;
          json = json.map((x) => formatPhotoData(x));
          res.json(json);
        }) // if saving fails, return a JSON with the error message
        .catch(function(err) {
          json.error = err.message;
          res.json(json);
        });
      // if Flickr API returns an error state, return a JSON with the error
      } else {
        json.error = result.message;
        res.json(result);
      }
    });
  });
}

module.exports = fetchImages;
