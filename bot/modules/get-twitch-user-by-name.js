var npmmodules = require("../npm-modules")

var config = require("../config.json")

module.exports = function(name = ""){
    return new Promise(resolve => {
        npmmodules.request.get("https://api.twitch.tv/helix/users?" + npmmodules.querystring.stringify({login: name}), {
            headers: {
                'Content-Type': 'application/json',
                'Client-Id': config.twitch.application.clientID,
                'Authorization': config.twitch.application.authorization,
            },
        }, (err, res, body) => {
            var data = JSON.parse(body)
            resolve(data.data[0])
        })
    })
}
