var restify = require('restify');
var builder = require('botbuilder');

// var bot = new builder.UniversalBot(connector);

// var builder = require('../../core/');

// Create bot and bind to console
// var connector = new builder.ConsoleConnector().listen();
// var bot = new builder.UniversalBot(connector);

var connector = new builder.ChatConnector({
    appId: process.env.APP_ID,
    appPassword: process.env.APP_SECRET
});

var bot = new builder.UniversalBot(connector);

// Setup Restify Server
var server = restify.createServer();
server.post('/api/messages', connector.listen());
server.listen(process.env.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
    console.log("LUIS URL :" + process.env.LUIS_URL);
});


// Create LUIS recognizer that points at our model and add it as the root '/' dialog for our Cortana Bot.
var model = process.env.LUIS_URL;
console.log("LUIS URL :" + process.env.LUIS_URL);
var recognizer = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', dialog);

dialog.matches('Greeting', [
    function (session) {
        session.send('Hello Greeting');
    }
    // function (session, args) {
       
    //     // builder.Prompts.text(session, "Hello There! How may I help you, I can help you in viewing available report types, and in requesting generation or particular reports"); //values to be read from JSON and shown
    //     // builder.Message.text(session, "Hello There! How may I help you, I can help you in viewing available report types, and in requesting generation or particular reports");
    //     console.log("Hello There! How may I help you");
    //    session.send("Hello There! How may I help you, I can help you in viewing available report types, and in requesting generation or particular reports");
    // }
]);



dialog.onDefault(builder.DialogAction.send("I'm sorry. I didn't understand."));