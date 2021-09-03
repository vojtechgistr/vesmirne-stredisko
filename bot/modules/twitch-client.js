var npmmodules = require("../npm-modules")

var config = require("../config.json")

var client = new npmmodules.tmijs.client({
    identity: {
        username: config.twitch.bot.username,
        password: config.twitch.bot.token
    },
    channels: [
        config.twitch.channel
    ]
})

client.connect().then(() => {
    console.log("Twitch bot logged in");
})

module.exports = client