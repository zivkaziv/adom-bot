'use strict';

// const pikudHaoref = require('pikud-haoref-api');//not in used

// Set polling interval in millis
var interval = 10000;
var restarted = true;
const twitMessager = require('./Twitter/twitter');
const telegram = require('./Telegram/telegram');
const axios = require('axios')
const express = require('express');
const app     = express();
// Define polling function
let poll = async() => {
    try{
        const res = await axios.get('https://alerts.ynet.co.il/alertsRss/YnetPicodeHaorefAlertFiles.js?callback=jsonCallback');
        //response looks like - "jsonCallback({"alerts": {"items": []}});"
        //trim it to json
        const dataStr = res.data.replace('jsonCallback(','').slice(0,-2);
        console.log(dataStr);
        const data = JSON.parse(dataStr);
        if(data.alerts && data.alerts.items.length){
            //{"alerts": {"items": [{"item": {"guid": "b3419d33-c1c8-4009-a08c-fd58d9a30ea9","pubdate": "09:27","title": "מפלסים","description": "היכנסו למרחב המוגן","link": ""}},{"item": {"guid": "b3419d33-c1c8-4009-a08c-fd58d9a30ea9","pubdate": "09:27","title": "מטווח ניר עם","description": "היכנסו למרחב המוגן","link": ""}},{"item": {"guid": "978cd0b4-2e75-4358-8094-bada5662b588","pubdate": "09:26","title": "מבטחים עמיעוז ישע","description": "היכנסו למרחב המוגן","link": ""}},{"item": {"guid": "978cd0b4-2e75-4358-8094-bada5662b588","pubdate": "09:26","title": "צוחר ואוהד","description": "היכנסו למרחב המוגן","link": ""}}]}}
            // console.log(data.alerts)
            const alertZones = data.alerts.items.map(item => {
                return item.item.title;
            })
            const text = generateText(alertZones);
            console.log(text);
            createTelegramMessage(text);
        }else{
            console.log('No alerts');
        }
    }catch(err){
        console.log(err);
    }
    setTimeout(poll, interval);
    // Get currently active rocket alert zones as an array of zone codes
    // Example response: ["גולן 1", "חיפה 75", "שפלה 182"]
    // pikudHaoref.getActiveRocketAlertZones(function (err, alertZones) {
    //     // Schedule polling in X millis
    //     setTimeout(poll, interval);

    //     // Log errors
    //     if (err) {
    //         return console.log('Retrieving active rocket alert zones failed: ', err);
    //     }
    //     // Alert zones header
    //     console.log('Currently active rocket alert zones:');

    //     // Log the alert zones (if any)
    //     console.log(alertZones);
    //     if(alertZones.length > 0 || restarted){
    //         if(restarted){
    //             restarted = false;
    //             //alertZones.push('Restarted');
    //         }
    //         let text = generateText(alertZones);
    //         //createTweet(text);
    //         createTelegramMessage(text);
    //     }
    //     // Line break for readability
    //     console.log();
    // });
};

let generateText = (alertZones) =>{
    return `צבע אדום ב:
${alertZones.join(', ')}
תעיפו את עצמכם למרחבים המוגנים...`;
};

let createTweet = (tweetText) =>{
    twitMessager.createAndPost(tweetText).then(function(){
        console.log('tweeting ' + tweetText);
    },function(err){
        console.log('Failed to replay tweet, Mark this user anyway...');
    });
};

let createTelegramMessage = (telegramText) =>{
    telegram.sendMessage(telegramText).then( () => {
        console.log('telegram  ' + telegramText);
    }, (e) => {
        console.log('Failed to send message on telegram ' + e);
    })
};


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
    poll();
});


