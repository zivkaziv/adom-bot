
const axios = require('axios');

module.exports = {
    sendMessage: (text) => {
        let textToSend= encodeURI(text);
        let urlToSend = 'https://api.telegram.org/bot' + process.env.TELEGRAM_TOKEN + '/sendMessage?chat_id=@tzevadom&text=' + textToSend;
        return axios.get(urlToSend);
    }
}