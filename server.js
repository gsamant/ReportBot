var restify = require('restify');
var builder = require('botbuilder');


// Create bot and add dialogs
var bot = new builder.BotConnectorBot({ appId: process.env.APP_ID, appSecret: process.env.APP_SECRET });


var dialog = new builder.LuisDialog(process.env.LUIS_URL);
bot.add('/', dialog);


dialog.on('Greeting', [
    function (session, args) {
       
        // builder.Prompts.text(session, "Hello There! How may I help you, I can help you in viewing available report types, and in requesting generation or particular reports"); //values to be read from JSON and shown
        // builder.Message.text(session, "Hello There! How may I help you, I can help you in viewing available report types, and in requesting generation or particular reports");
       session.send("Hello There! How may I help you, I can help you in viewing available report types, and in requesting generation or particular reports");
    }
]);

dialog.on('ShowReportTypes', [
    function (session, args) {
       
        // builder.Message.text(session, "You can generate the following reports : 1,2,3"); //values to be read from JSON and shown
        session.send("You can generate the following reports : 1- Profile Report, 2-Trend Report");
       
    }
]);

dialog.on('GenerateReport', [
    function (session, args, next) {
        var reportType = builder.EntityRecognizer.findEntity(args.entities, 'ReportType');
        var reportParams = session.dialogData.reportParams = {
          reportType: reportType ? reportType.entity : null,
          openCount : null,
          sentCount : null,
          subjectLine : null,
          
        };
        
        if (!reportParams.reportType) {
            // builder.Message.text(session, "Could not Identify which report you want to generate");
            builder.Prompts.text(session, "Could not Identify Report Name. You can generate the following reports : 1- Profile Report, 2-Trend Report");
        } 
        else {
            next();
        }
    },
    function (session, args, next) {
        var reportParams = session.dialogData.reportParams;
        if (reportParams.reportType && !reportParams.openCount) {
            builder.Prompts.text(session,"Set OpenCount");
        }
        else{
            next();
        }
    },
    function (session, results, next) {
        var reportParams = session.dialogData.reportParams;
        if (results.response) {
           reportParams.openCount = results.response;
        }

        if (reportParams.reportType && reportParams.openCount && !reportParams.sentCount) {
            builder.Prompts.text(session,"Set SentCount");
        }
        else{
            next();
        }
    },
    function (session, results, next) {
        var reportParams = session.dialogData.reportParams;
        if (results.response) {
           reportParams.sentCount = results.response;
        }

        if (reportParams.reportType && reportParams.openCount && reportParams.sentCount && !reportParams.subjectLine) {
            builder.Prompts.text(session,"Set Subject Line");
        }
        else{
            next();
        }
    },
    function (session, results, next) {
        var reportParams = session.dialogData.reportParams;
        if (results.response) {
           reportParams.subjectLine = results.response;
        }

        if (reportParams.reportType && reportParams.openCount && reportParams.sentCount && reportParams.subjectLine) {
            builder.Prompts.text(session,"Creating "+reportParams.reportType+" report with Sent Count-"+reportParams.sentCount+", Open Count-"+reportParams.openCount+" and Subject Line-"+reportParams.subjectLine);
        }
        else{
            next();
        }
    }
    
]);




dialog.onDefault(builder.DialogAction.send("I'm sorry. You can generate the following reports : 1- Profile Report, 2-Trend Report"));

var server = restify.createServer();
server.post('/api/messages', bot.verifyBotFramework(), bot.listen());
server.listen(process.env.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});