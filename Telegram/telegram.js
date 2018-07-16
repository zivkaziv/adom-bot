
const axios = require('axios');

module.exports = {
    sendMessage: (text) => {
        return axios.get('https://api.telegram.org/bot' + process.env.TELEGRAM_TOKEN + '/sendMessage?chat_id=@tzevadom&text=' + text);
    }
}