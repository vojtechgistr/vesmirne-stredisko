var modules = {
    mongodb: require("./mongodb"),
    discordClient: require("./discord-client"),
    haveItem: require("./have-item"),
    getTwitchUserByTwitchID: require("./get-twitch-user-by-twitch-id")
}

var npmmodules = require("../npm-modules")
const config = require("../config.json")

module.exports = async function parseData(body, req, title = "", otherData = {}){
    var responseData = {data:{}, discordLoginPage: config.discord.application.loginPage, twitchLoginPage: config.twitch.application.loginPage} //data that will be sended to the web client

    Object.keys(otherData).forEach(key => {
        responseData.data[key] = otherData[key]
    })
    
    if(req.user){
        responseData.data.user = req.user
        responseData.data.user.points = await modules.haveItem(new npmmodules.mognodb.ObjectID(req.user._id), 0)
        if(modules.discordClient.users.cache.get(req.user.discord_id)){
            responseData.data.user.profilePicture = "https://cdn.discordapp.com/avatars/" + req.user.discord_id + "/" + modules.discordClient.users.cache.get(req.user.discord_id).avatar
            responseData.data.discordUser = modules.discordClient.users.cache.get(req.user.discord_id)
        }
        // if(req.user.twitch_id){
        //     responseData.data.twitchUser = await modules.getTwitchUserByTwitchID(req.user.twitch_id)
        // }
    }
    
    responseData.data.events = await modules.mongodb.collections.events.find({}).toArray() //events from DB

    if(title)
        responseData.titleWithName = title + " | Vesmírné Středisko"
    else
        responseData.titleWithName = "Vesmírné Středisko"

    responseData.title = title

    if(body)
        responseData.body = npmmodules.fs.readFileSync(process.cwd() + "\\web\\bodys\\" + body + ".html").toString() //page body

    responseData.data = JSON.stringify(responseData.data) //stringifying for sending

    var onlineCount = 0
    modules.discordClient.users.cache.forEach(element => {
        if(element.presence.status == 'dnd' || element.presence.status == "online" || element.presence.status == "idle"){
            onlineCount++
        }
    })
    responseData.onlineCount = onlineCount

    return responseData
}