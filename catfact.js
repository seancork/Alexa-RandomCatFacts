'use strict';
var Alexa = require('alexa-sdk');
var request = require('request');
//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: var APP_ID = "amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1";
var APP_ID = "insert-appid";

var SKILL_NAME = "Random Cat Fact";
var GET_START_OF_FACT_MESSAGE = "Here's your fact: ";
var HELP_MESSAGE = "I can tell you a cat fact, or, you can say exit... What can I help you with?";
var HELP_REPROMPT = "What can I help you with?";
var STOP_MESSAGE = "Goodbye!";

//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================
exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('GetCatFactIntent');
    },
    'GetCatFactIntent': function () {
      var speechOutput;
      var self = this;
      getCatFact(function(fact) {
        if(quote != "ERROR") {
            speechOutput = GET_START_OF_FACT_MESSAGE + fact;
        }
        else {
          speechOutput = "Sorry, Cannot find any cat facts right now!";
        }
        self.emit(':tellWithCard', speechOutput, SKILL_NAME, fact);
      })

      function getCatFact(callback) {
        var url ="https://catfact.ninja/fact";
        request.get(url, function(error, response, body) {
          var data = JSON.parse(body);
          var result = "ERROR";
              result = data.fact;
  
          callback(result);
        })
      }
    },

    'AMAZON.HelpIntent': function () {
        var speechOutput = HELP_MESSAGE;
        var reprompt = HELP_REPROMPT;
        this.emit(':ask', speechOutput, reprompt);
    },

    'AMAZON.CancelIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    },

    'AMAZON.StopIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    },

    'Unhandled': function () {
        this.emit(':ask', HELP_MESSAGE, HELP_MESSAGE);
    }
};