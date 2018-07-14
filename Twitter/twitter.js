
const Twit = require('twit');
const config = {
    consumer_key: 'ZFd2vmgHT0PwIXpInLNUY7en7',
    consumer_secret: 'DkhOY2IIUAeADlQwSYAw6915nJe7pYzEEMBXiV7Jizgg5vDTx6',
    access_token: '816669683420168192-GITXTydXdsf9Iaz1UsKnzbPxJZzv05Z',
    access_token_secret: 'mAYs2gKDtVxldbk0feQqBJ5SuvmFb5i4Sj0OZ2Ax6hVCX'
    // consumer_key: process.env.CONSUMER_KEY,
    // consumer_secret: process.env.CONSUMER_SECRET,
    // access_token: process.env.ACCESS_TOKEN,
    // access_token_secret: process.env.ACCESS_TOKEN_SECRET
};
let twit = new Twit(config);

module.exports = {
  createAndPost: (message,tweetToResponseOn) => {
    let tweet = {
      status: message
    };
    if(tweetToResponseOn){
      tweet.in_reply_to_status_id = tweetToResponseOn.id_str
    }
    return new Promise(function (resolve, reject) {
      twit.post('statuses/update', tweet, function (err) {
        if (err){
          reject(err)
        }
        resolve();
      })
    });
  }
};
