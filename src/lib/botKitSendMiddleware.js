module.exports = function(client, options) {
    return function(bot, message, next) {
        client.addEvent('message_sends', message, function(err) {
            if (err)
                bot.botkit.log("[Keen IO] Failed to save message_sends event", err);
            else if (options && options.debug)
                bot.botkit.log("[Keen IO] Saved message_sends event.");
        });
        // Don't block
        return next && next();
    };
};
