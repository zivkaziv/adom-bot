'use strict';

const pikudHaoref = require('pikud-haoref-api');

// Set polling interval in millis
var interval = 5000;

const twitMessager = require('./Twitter/twitter');

// Define polling function
let poll = () => {
    // Get currently active rocket alert zones as an array of zone codes
    // Example response: ["גולן 1", "חיפה 75", "שפלה 182"]
    pikudHaoref.getActiveRocketAlertZones(function (err, alertZones) {
        // Schedule polling in X millis
        setTimeout(poll, interval);

        // Log errors
        if (err) {
            return console.log('Retrieving active rocket alert zones failed: ', err);
        }

        // Alert zones header
        console.log('Currently active rocket alert zones:');

        // Log the alert zones (if any)
        console.log(alertZones);
        if(alertZones.length > 0){
            createTweet(alertZones);
        }
        // Line break for readability
        console.log();
    });
};

let generateTweetText = (alertZones) =>{
    return alertZones.join(',');
};

let createTweet = (alertZones) =>{
    let tweetText = '';
    tweetText += generateTweetText(alertZones);

    twitMessager.createAndPost(tweetText).then(function(){
        console.log('tweeting ' + tweetText);
    },function(err){
        console.log('Failed to replay tweet, Mark this user anyway...');
    });
};

poll();



