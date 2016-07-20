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
// dialog.re

dialog.matches('Greeting', [
    function (session) {
        session.send(process.env.GREETING_MESSAGE);
    }
    
]);


dialog.matches('WhatToSell', [
   
    function (session,args,next) {
        console.log("Builder Entities : " + builder.entities);
        session.send("Builder Entities : " + builder.entities);
        session.send("You want to find what you can sell :");
        session.userData.location = builder.EntityRecognizer.findEntity(args.entities, 'Location');
        session.userData.timeRange = builder.EntityRecognizer.findEntity(args.entities, 'Time Range');
        session.userData.product = builder.EntityRecognizer.findEntity(args.entities, 'Product');
        if(!session.userData.location)
        {
          builder.Prompts.choice(session, "Please select the location", ["Mumbai", "Pune","Maharashtra","India"]);
          
        }
        
    },
    function (session,results,next) {
        
        if(results.response)
        {
          session.userData.location = results.response.entity;
        }
        if(!session.userData.timeRange)
        {
          builder.Prompts.choice(session, "Please select the time range", ["yesterday", "this week","last week","last month"]);
          
        }
        
    },
    function (session,results,next) {
        
       if(results.response)
        {
          session.userData.timeRange = results.response.entity;
        }
      
        if(!session.userData.product)
        {
          builder.Prompts.text(session, "Please select a product");
          
        }
    },
    function (session,results,next) {
        
       if(results.response)
        {
          session.userData.product = results.response;
        }
      
       
    },
    
    function (session, results) {

        if(session.userData.location && session.userData.timeRange && session.userData.product)
        {
        session.send("You want to generate the What to Sell report for Product : " + session.userData.product + 
                     " Location : " + session.userData.location + 
                     " Time Range : " + session.userData.timeRangee );
        }
    }
    
]);


dialog.onDefault(builder.DialogAction.send("I'm sorry. I didn't understand."));