
var integration = require('segmentio-integration');
var mapper = require('./mapper');
var Batch = require('batch');

/**
 * Expose `rockerbox`
 *
 * https://github.com/segmentio/analytics.js-private/issues/79
 */

var Rockerbox = module.exports = integration('Rockerbox')
  .endpoint('https://getrockerbox.com/pixel')
  .channels(['server', 'mobile'])
  .ensure('settings.source')
  .ensure('settings.allAnSeg')
  .ensure('message.userId')
  .mapping('events')
  .mapper(mapper)
  .retries(2);

/**
 * Track.
 *
 * https://github.com/segmentio/analytics.js-private/issues/79
 *
 * @param {Object} payload
 * @param {Function} fn
 * @api public
 */

Rockerbox.prototype.track = function(payload, fn){
  var source = this.settings.source;
  var batch = new Batch();
  var self = this;

  payload.forEach(function(item){
    batch.push(function(done){
      return self
          .get('')
          .type('json')
          .query(item)
          .query({ source: source })
          .query({ adnxs_uid: 0 })
          .end(self.handle(done));
      });
  });

  batch.end(fn);
};

/**
 * Page.
 *
 * https://github.com/segmentio/analytics.js-private/issues/79
 *
 * @param {Object} payload
 * @param {Function} fn
 * @api public
 */

Rockerbox.prototype.page = function(_, fn){
  var source = this.settings.source;
  var allAnSeg = this.settings.allAnSeg;
  var customerAnSeg = this.settings.customerAnSeg;
  var batch = new Batch();
  var self = this;

  if (customerAnSeg) {
    batch.push(function(done){
      return self
          .get('')
          .redirects(2)
          .type('json')
          .query({ source: source })
          .query({ type: 'imp' })
          .query({ an_seg: customerAnSeg })
          .end(self.handle(done));
    });
  }

  batch.push(function(done){
    return self
        .get('')
        .redirects(2)
        .type('json')
        .query({ source: source })
        .query({ type: 'imp' })
        .query({ an_seg: allAnSeg })
        .end(self.handle(done));
  });

  batch.end(fn);
};
