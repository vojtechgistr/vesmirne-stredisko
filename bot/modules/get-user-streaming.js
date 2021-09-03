var npmmodules = require("../npm-modules")

var config = require("../config.json")

module.exports = async function(id){
    return new Promise(resolve => {
        npmmodules.request.get("https://api.twitch.tv/helix/streams/?" + npmmodules.querystring.stringify({"user_id": id}), {
            headers: {
                'Content-Type': 'application/json',
                'Client-Id': config.twitch.application.clientID,
                'Authorization': config.twitch.application.authorization,
            },
        }, (err, res, body) => {
            try{
                var data = JSON.parse(body)
                if(data.data && data.data[0]){
                    resolve(true)
                }else{
                    resolve(false)
                }
            }catch{}
            
        })
    })
}