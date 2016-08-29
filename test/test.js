'use strict';
/* Important to start the appropiate MongoDB database */
process.env.NODE_ENV = 'test';

var chai = require('chai'),
    chaiHttp = require('chai-http'),
    expect = chai.expect;

/* Avoid OverwriteModelError with mocha 'watch' */
var mongoose = require('mongoose');
mongoose.models = {};
mongoose.modelSchemas = {};

var server = require('../app');

chai.use(chaiHttp);

var SearchQuery = require('../app/models/searchQuery');

describe('Image search', function() {
  /* Before anything, drop the collection */
  SearchQuery.collection.drop();
  /* Before every test, save a dummy document in the collection */
  beforeEach(function(done) {
    var newTerm = new SearchQuery({
      term : 'lolcats funny',
      when: '2016-08-15T09:51:47.491Z'
    }).save(done);
  });
  /* After every test, drop the collection */
  afterEach(function(done) {
    SearchQuery.collection.drop();
    done();
  });

  it('print out the index.html page in / GET', function(done) {
    chai.request(server)
    .get('/')
    .end(function(err, res) {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res).to.be.html;
      done();
    });
  });

  it('search and return image results in /search/:searchQuery GET', function(done){
    chai.request(server)
    .get('/search/lolcats funny')
    .end(function(err, res) {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res).to.include.keys('body');
      expect(res.body).to.be.an('array');
      var result = res.body[0];
      expect(result).to.be.an('object');
      expect(result).to.include.all.keys(['imageURL', 'altText', 'thumbnail', 'pageURL', 'ownerProfile']);
      expect(result.imageURL).to.be.a('string');
      expect(result.altText).to.be.a('string');
      expect(result.thumbnail).to.be.a('string');
      expect(result.pageURL).to.be.a('string');
      expect(result.ownerProfile).to.be.a('string');
      done();
    });
  });

  it('search and return page 2 of image results in /search/:searchQuery?offset=2 GET', function(done){
    chai.request(server)
    .get('/search/lolcats funny')
    .query({offset: 2})
    .end(function(err, res) {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res).to.include.keys('body');
      expect(res.body).to.be.an('array');
      var result = res.body[0];
      expect(result).to.be.an('object');
      expect(result).to.include.all.keys(['imageURL', 'altText', 'thumbnail', 'pageURL', 'ownerProfile']);
      expect(result.imageURL).to.be.a('string');
      expect(result.altText).to.be.a('string');
      expect(result.thumbnail).to.be.a('string');
      expect(result.pageURL).to.be.a('string');
      expect(result.ownerProfile).to.be.a('string');
      done();
    });
  });

  it('get latest search terms in DB in /latest GET', function(done) {
    chai.request(server)
    .get('/latest')
    .end(function(err, res) {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res).to.include.keys('body');
      expect(res.body).to.be.an('array');
      var result = res.body[0];
      expect(result).to.be.an('object');
      expect(result).to.include.all.keys(['term', 'when']);
      expect(result.term).to.be.a('string');
      expect(result.when).to.be.a('string');
      expect(result.term).to.be.equal('lolcats funny');
      expect(result.when).to.be.equal('2016-08-15T09:51:47.491Z');
      done();
    });
  });
});
