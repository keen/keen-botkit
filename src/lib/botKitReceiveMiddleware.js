module.exports = function(client) {
    return function(bot, message, next) {
        if (!message) return next && next();

        // Don't track messages we have sent as received messages
        if (message && message.user === bot.identity.id)
            return next && next();

        // Our replys – don't track
        if ((message && message.ok) || (message && message.reply_to))
            return next && next();

        // Don't track slack connection events
        if (message && (message.type === 'hello' || message.type === 'reconnect_url'))
            return next && next();

        bot.findConversation(message, function(conversation) {
            client.addEvent('message_received', message, function(err) {
                if (err)
                    bot.botkit.log("[Keen IO] Failed to save message_received event", err);
                else
                    bot.botkit.log("[Keen IO] Saved message_received event.");
            });
            return next && next();
        });
    };
};
