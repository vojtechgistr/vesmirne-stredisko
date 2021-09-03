var npmmodules = require("../npm-modules")

var config = require("../config.json")
const modules = {
    getUserStreaming: require("./get-user-streaming"),
    getTwitchUserByName: require("./get-twitch-user-by-name"),
    mongodb: require("./mongodb")
}

async function getMultiplier(viewers){
    return viewers.map(async chatter => {
        var multiplier = 1
        var user = await modules.getTwitchUserByName(chatter)
        const sub = await npmmodules.got('https://api.twitch.tv/helix/subscriptions?' + npmmodules.querystring.stringify({broadcaster_id:  config.twitch.channelID, user_id: user.id}), {headers: {
            'Content-Type': 'application/json',
            'Client-Id': config.twitch.application.clientID,
            'Authorization': config.twitch.application.authorization,
        }, method: "GET" });
        if(JSON.parse(sub.body).data[0])
            multiplier = multiplier * 1.5

        const follow = await npmmodules.got('https://api.twitch.tv/helix/users/follows?' + npmmodules.querystring.stringify({from_id: user.id, to_id: config.twitch.channelID}), {headers: {
            'Content-Type': 'application/json',
            'Client-Id': config.twitch.application.clientID,
            'Authorization': config.twitch.application.authorization,
        }, method: "GET" });
        if(JSON.parse(follow.body).data[0])
            multiplier = multiplier * 2
        return {id: user.id, multiplier: multiplier}
    })
}

module.exports = function(){
    npmmodules.request("http://tmi.twitch.tv/group/user/" + config.twitch.channel + "/chatters", {}, async (error, response, body) => {
        try{
            body = JSON.parse(body)
            if(!body.chatters)
                return
            var viewers = []
            body.chatters.viewers.forEach(chatter => viewers.push(chatter))
            body.chatters.viewers.forEach(chatter => viewers.push(chatter))
            body.chatters.global_mods.forEach(chatter => viewers.push(chatter))
            body.chatters.admins.forEach(chatter => viewers.push(chatter))
            body.chatters.staff.forEach(chatter => viewers.push(chatter))
            body.chatters.moderators.forEach(chatter => viewers.push(chatter))
            body.chatters.vips.forEach(chatter => viewers.push(chatter))
        
            var live = await modules.getUserStreaming(config.twitch.channelID)
            // chech if user is streaming
            if(!live)
                viewers = []
        
            Promise.all(await getMultiplier(viewers)).then(data => {
                data.forEach(async data => {
                    var databaseUser = await modules.mongodb.collections.users.findOne({twitch_id: data.id})
                    if(!databaseUser)
                        return
                    modules.mongodb.collections.items.insertOne({user_id: databaseUser._id, item_id: 0, count: 0.5 * data.multiplier})
                })
            })
        }catch{() => {}}
    })
}
