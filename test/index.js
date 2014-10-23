
var Test = require('segmentio-integration-tester');
var Rockerbox = require('../');
var mapper = require('../lib/mapper');
var should = require('should');
var assert = require('assert');
var clone = require('clone');
var qs = require('qs');

describe('Rockerbox', function(){
  var rockerbox;
  var settings;
  var test;

  beforeEach(function(){
    settings = {
      source: 'bonobos',
      allAnSeg: 1683871,

    };
    rockerbox = new Rockerbox(settings)
    test = Test(rockerbox, __dirname);
    test.mapper(mapper);
  });

  it('should have the correct settings', function(){
    test
      .name('Rockerbox')
      .channels(['server', 'mobile'])
      .ensure('settings.source')
      .ensure('settings.allAnSeg')
      .ensure('message.userId')
      .retries(2);
  });

  describe('.validate()', function() {
    it('should not be valid without a source', function(){
      delete settings.source;
      test.invalid({ userId: 'abc' }, settings);
    });

    it('should not be valid without an allAnSeg', function(){
      delete settings.allAnSeg;
      test.invalid({ userId: 'abc' }, settings);
    });

    it('should not be valid without a userId', function(){
      test.invalid({}, settings);
    });

    it('should be valid with complete settings', function(){
      test.valid({ userId: 'abc' }, settings);
    });
  });

  describe('mapper', function(){
    describe('track', function(){
      it('should map basic track', function(){
        test.maps('track-basic');
      });
    });
  });


  describe('.track()', function(){
    it('should send basic track', function(done){
      var json = test.fixture('track-basic');
      test
        .set(settings)
        .track(json.input)
        .query(json.output)
        .expects(200, done);
    });

    it('should not make a request if conversion event does not exist', function(done){
      test
        .set(settings)
        .track({ event: 'invalid event' })
        .end(function(err, res){
          assert(!err);
          assert.deepEqual(res, []);
          done(err);
        });
    });

    it('should return an array if multiple events match', function(done){
      var json = test.fixture('track-multiple');
      test
        .set(settings)
        .track(json.input)
        .query(json.output)
        .expects(200, done);
    });
  });

  describe('.page()', function(){
    it.skip('should send a page', function(done){
      test
        .page({})
        .query({ source: 'bonobos' })
        .query({ type: 'imp' })
        .query({ an_seg: 1675564 })
        .expects(200, done);
    });
  });
});
