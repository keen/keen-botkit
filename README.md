# Keen IO BotKit Integration

We've made it very easy to track messages and conversations within your Slack bot (built with [bot-kit](https://github.com/howdyai/botkit)), so you can analyze the usage of your bot.

If you have custom needs, you can always fork this project and make modifications. 

Read to get started? [Create a free Keen IO account](keen.io/signup?s=gh-botkit-readme) to grab your projectId and writeKey.

## Install

Keen IO Bot-Kit is available via NPM.

```bash
npm install keen-botkit --save
```

If you want to use the example code, you can also clone it directly from Git.

```bash
git clone git@github.com:nemo/keen-botkit.git
```

Note that after cloning, you'll have to install the dependencies (which is just [keen-js](https://github.com/keen/keen-js):

```bash
npm install
```

Look at [example section](#example) for how to use the example.

## Usage

The integration works by adding middleware to Botkit using its [middleware system](https://github.com/howdyai/botkit#middleware). We intersect every interaction and send an event to Keen IO.

Specifically, on the `send` and `receive` middleware. To initialize the middleware, you have to pass an initialized Keen IO client from [keen-js](https://github.com/keen/keen-js)):

```javascript
var KeenBotKitIntegration = require('keen-botkit');

// Initialize Keen IO client
var client = new Keen({
    projectId: "<projectId>",
    writeKey: "<writeKey>"
});

// prepare middleware
var receiveMiddleware = KeenBotKitIntegration.botKitReceiveMiddleware(client);
var sendMiddleware = KeenBotKitIntegration.botKitSendMiddleware(client);
```

And then simply apply the middleware to your Botkit controller:

```javascript
var controller = Botkit.slackbot({
    debug: true,
});

controller.middleware.receive.use(receiveMiddleware);
controller.middleware.send.use(sendMiddleware);
```
### Collection Name

By default, the middleware sent events to collections named `message_received` and `message_sends` for received messages and sent messages respectively. You can modify this behavior by passing in a `collection` option:

```javascript
var KeenBotKitIntegration = require('keen-botkit');

var receiveMiddleware = KeenBotKitIntegration.botKitReceiveMiddleware(client, {
  collection: 'user_messages'
});

var sendMiddleware = KeenBotKitIntegration.botKitSendMiddleware(client, {
  collection: 'bot_messages'
});
```

### Payload

In the spirit of customizability, you can modify the payload that is sent to Keen by providing a `payload` object or function to modify the payload before it goes out:

```javascript
var KeenBotKitIntegration = require('keen-botkit');

// Works for both botKitSendMiddleware and botKitReceiveMiddleware
var sendMiddleware = KeenBotKitIntegration.botKitSendMiddleware(client, {
  payload: function(message, callback) {
    // Modify message or pass your own payload
    message._user_id = '10';

    callback(null, message);
  }
});

var sendMiddleware = KeenBotKitIntegration.botKitSendMiddleware(client, {
  payload: {
    static_attribute: 9000
  }
});
```

### Debug

By default, errors are logged. But if you want to get some logs on successful event saves – just pass in `debug: true` as the second argument when you initialize the middleware:

```javascript
var KeenBotKitIntegration = require('keen-botkit');

var receiveMiddleware = KeenBotKitIntegration.botKitReceiveMiddleware(client, {debug: true});
var sendMiddleware = KeenBotKitIntegration.botKitSendMiddleware(client, {debug: true});
```

## Example

There's a short example included in the [slack_bot_example.js](https://github.com/nemo/keen-botkit/blob/master/slack_bot_example.js) file.

Note that you have to get a [Bot token from Slack](http://my.slack.com/services/new/bot) and then run the example from the command line:

```bash
token=<MY TOKEN> node slack_bot_example.js
```

If you want to view the events that are sent to Keen IO on your own account, you should replace the credentials on [line 79](https://github.com/nemo/keen-botkit/blob/master/slack_bot_example.js#L79).

## Contributing

This is an open source project that started within the Keen IO Community ([you can read more about its creator here](https://medium.com/@ngardideh/tracking-conversations-with-botkit-and-keen-io-63a9209a12da#.s11jcdoo8). We'd love future involvement from the community! 💖 If you are interested in getting involved, please see [CONTRIBUTING.md](CONTRIBUTING.md) to get started.
