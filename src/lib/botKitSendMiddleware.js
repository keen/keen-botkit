module.exports = function(client, options) {
  var eventCollection = options && options.collection || 'message_sends';
  var payloadMiddleware = function(payload, cb) {
    if (!options.payload) return cb(null, payload);

    if (typeof options.payload === 'function') {
      return options.payload(Object.assign({}, payload), cb);
    } else if (typeof options.payload === 'object') {
      return cb(null, Object.assign(payload, options.payload));
    } else return cb(null, payload);
  };

  return function(bot, message, next) {
    payloadMiddleware(message, function(err, payload) {
      if (err)
        return bot.botkit.log("[Keen IO] Payload middleware failed for message_sends.", err);

      client.addEvent(eventCollection, payload, function(err) {
        if (err)
          bot.botkit.log("[Keen IO] Failed to save message_sends event", err);
        else if (options && options.debug)
          bot.botkit.log("[Keen IO] Saved message_sends event.", payload);
      });
    });

    // Don't block
    next && next();
  };
};
