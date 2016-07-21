var restify = require('restify');
var builder = require('botbuilder');
// var request = require('request');


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

    function (session, args, next) {
       
        session.dialogData.location = "";
        session.dialogData.product = "";
        session.dialogData.timeRange = "";
        session.send("You want to find what you can sell :");
        if (builder.EntityRecognizer.findEntity(args.entities, 'Location')) {
            // session.send("Setting Location");
            session.dialogData.location = builder.EntityRecognizer.findEntity(args.entities, 'Location').entity;
            //    session.send("Setting Location");
        }
        if (builder.EntityRecognizer.findEntity(args.entities, 'TimeRange')) {
            //   session.send("Setting TimeRange");
            session.dialogData.timeRange = builder.EntityRecognizer.findEntity(args.entities, 'TimeRange').entity;
        }
        if (builder.EntityRecognizer.findEntity(args.entities, 'Product')) {
            //   session.send("Setting Product");
            session.dialogData.product = builder.EntityRecognizer.findEntity(args.entities, 'Product').entity;
        }

        if (!session.dialogData.location) {
            builder.Prompts.choice(session, "Please select the location", ["Mumbai", "Pune", "Maharashtra", "India"]);
        }
        else {
            next();
        }
       
    },
    function (session, results, next) {

        if (results.response) {
            session.dialogData.location = results.response.entity;
        }
      
        if (!session.dialogData.timeRange) {
            builder.Prompts.choice(session, "Please select the time range", ["yesterday", "this week", "last week", "last month"]);
        }
        else {
            next();
        }



    },
    function (session, results, next) {

        if (results.response) {
            console.log(results.response);
            session.dialogData.timeRange = results.response.entity;
        }

        if (!session.dialogData.product) {
            builder.Prompts.text(session, "Please select a product");

        }
        else {
            next();
        }
        // next();
    },
    function (session, results, next) {

        if (results.response) {
            session.dialogData.product = results.response;
        }
        next();

    },

    function (session) {

        if (session.dialogData.location && session.dialogData.timeRange && session.dialogData.product) {
            session.send("You want to generate the What to Sell report for Product : " + session.dialogData.product +
                " Location : " + session.dialogData.location +
                " Time Range : " + session.dialogData.timeRange);
        }
    }

]);


dialog.onDefault(builder.DialogAction.send("I'm sorry. I didn't understand."));

// dialog.onDefault([
// function(session, args, next) {
//     request({
//         uri : "https://www.bing.com",
//         method : "GET",
//         json : true,
//     }, function(error, response, jbody){
//         if(error) {
//             console.log(error);
//         }
//         next();
//     })
// },
//  function (session) {

       
//             session.send("Next Function executed " );
//         }
    
// ]);