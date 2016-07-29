# Keen IO Bot Integration

We've made it very easy to track messages and conversations within your Slack bot (built with [bot-kit](https://github.com/howdyai/botkit)), so you can analyze the usage of your bot.

If you have custom needs, you can always fork this project and make modifications. If you don't know about Keen IO, [check it out](https://keen.io)!

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
var KeenBotKitIntegration = require('./index');

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

### Debug

By default, errors are logged. But if you want to get some logs on successful event saves – just pass in `debug: true` as the second argument when you initialize the middleware:

```javascript
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
