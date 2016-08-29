'use strict';

var router = require('express').Router();
var fetchLastQueries = require('./fetchLastQueries.js');
var fetchImages = require('./fetchImages.js');

router.get('/latest', fetchLastQueries);
router.get('/search/:searchQuery', fetchImages);

module.exports = router;
