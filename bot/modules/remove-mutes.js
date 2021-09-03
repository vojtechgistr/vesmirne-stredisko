var modules = {
    mongodb: require("./mongodb"),
    discordClient: require("./discord-client")
}

var config = require('../config.json')

module.exports = async function(){
    var mutes = await modules.mongodb.collections.mutes.find({expiresIn: {$lt: new Date()}, $or: [{unmuted: false}, {unmuted: undefined}]}).toArray()
    mutes.forEach(async mute => {
        
        var muterole = await modules.discordClient.guilds.cache.first().roles.cache.find(r => r.id == config.discord.guild.muteRole)

        var member = modules.discordClient.guilds.cache.first().members.cache.get((await modules.mongodb.collections.users.findOne({_id: mute.user_id}) || {}).discord_id)

        if(!member){
            await modules.mongodb.collections.mutes.updateOne({_id: mute._id}, {$set: {unmuted: true}})
            return
        }

        member.roles.remove(muterole)

        await modules.mongodb.collections.mutes.updateOne({_id: mute._id}, {$set: {unmuted: true}})
    })
    
}