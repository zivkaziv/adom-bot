
const Twit = require('twit');
const config = {
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
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
