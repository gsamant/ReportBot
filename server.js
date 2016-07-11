var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.APP_ID,
    appPassword: process.env.APP_SECRET
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

// bot.dialog('/', function (session) {
//     session.send("Hello World");
// });


// var restify = require('restify');
// var builder = require('botbuilder');


// // Create bot and add dialogs
// var bot = new builder.BotConnectorBot({ appId: process.env.APP_ID, appPassword: process.env.APP_SECRET });


var dialog = new builder.LuisDialog(process.env.LUIS_URL    );
bot.dialog('/', dialog);

bot.on('typing', function (message) {
   // Check for group conversations
 console.log(message);
});

dialog.on('ShowReportTypes', [
    function (session, args) {
       
       
        // builder.Message.text(session, "You can generate the following reports : 1,2,3"); //values to be read from JSON and shown
        session.send("You can generate the following reports : 1,2,3");
       
    }
]);

dialog.on('Greeting', [
    function (session, args) {
       
        // builder.Prompts.text(session, "Hello There! How may I help you, I can help you in viewing available report types, and in requesting generation or particular reports"); //values to be read from JSON and shown
        // builder.Message.text(session, "Hello There! How may I help you, I can help you in viewing available report types, and in requesting generation or particular reports");
       session.send("Hello There! How may I help you, I can help you in viewing available report types, and in requesting generation or particular reports");
    }
]);

dialog.on('GenerateReport', [
    function (session, args) {
       
        var reportType = builder.EntityRecognizer.findEntity(args.entities, 'ReportType');
        console.log(" Session : " + String(session.message) );
        console.log("Session message type : " + session.message.type);
        console.log("session strigified: " + JSON.stringify(session.message));
        console.log("Sesion User Data : " + session.userData.name);
        console.log("Session from : " + session.message.from);
        console.log("Session to : " + session.message.to);
        console.log("Session conversationId : " + session.message.conversationId);
        console.log("Session channelMessageId : " + session.message.channelMessageId);
        console.log("Session channelConversationId : " +session.message.channelConversationId);
        
        if (!reportType) {
            // builder.Message.text(session, "Could not Identify which report you want to generate");
            session.send("Could not Identify which report you want to generate");
            
        } else {
            // next({ response: task.entity });
            // builder.Message.text(session, "Do you want to generate the " + reportType.entity + " report");
            session.send("Do you want to generate the " + reportType.entity + " report");
        }
        
       
    }
]);

dialog.onDefault(builder.DialogAction.send("I'm sorry. I didn't understand."));

// var server = restify.createServer();
// server.post('/api/messages', bot.verifyBotFramework(), bot.listen());
// server.listen(process.env.port || 3978, function () {
//     console.log('%s listening to %s', server.name, server.url);
// });