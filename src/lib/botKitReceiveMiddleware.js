module.exports = function(client, options) {
  var eventCollection = options && options.collection || 'message_received';
  var payloadMiddleware = function(payload, cb) {
    if (options && !options.payload) return cb(null, payload);

    if (options && typeof options.payload === 'function') {
      return options.payload(Object.assign({}, payload), cb);
    } else if (options && typeof options.payload === 'object') {
      return cb(null, Object.assign(payload, options.payload));
    } else return cb(null, payload);
  };

  return function(bot, message, next) {
    if (!message) return next && next();

    // Don't track messages we have sent as received messages
    if (message && message.user === bot.identity.id)
      return next && next();

    // Our replys – don't track
    if ((message && message.ok) || (message && message.reply_to))
      return next && next();

    // Don't track slack / irc events that aren't message related
    if (message && (message.type !== 'message'))
      return next && next();

    bot.findConversation(message, function(conversation) {
      payloadMiddleware(message, function(err, payload) {
        if (err)
          return bot.botkit.log("[Keen IO] Payload middleware failed for message_received.", err);

        client.addEvent(eventCollection, payload, function(err) {
          if (err)
            bot.botkit.log("[Keen IO] Failed to save message_received event", err);
          else if (options && options.debug)
            bot.botkit.log("[Keen IO] Saved message_received event.", payload);
        });
      });

      // Don't block;
      return next && next();
    });
  };
};
