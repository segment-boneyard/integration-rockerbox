/**
 * Map track
 *
 * @param {Track} track
 * @param {Object} settings
 * @return {Object}
 * @api private
 */

exports.track = function(track){
  var events = this.events(track.event());

  return events.map(function(event){
    var conversionId = event.conversionId;
    var segmentId = event.segmentId;
    var property = event.property || 'email';
    var id;

    switch (property) {
      case 'email':
        id = track.email();
        break;
      case 'orderId':
        id = track.orderId();
        break;
      case 'userId':
        id = track.userId();
        break;
      case 'revenue':
        id = track.revenue();
        break;
    }

    return {
      id: conversionId,
      seg: segmentId,
      order_type: id,
      type: 'segmentio_conv'
    };
  });
};
