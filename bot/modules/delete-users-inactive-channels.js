var npmmodules = require("../npm-modules")

var modules = {
    discordClient: require("./discord-client")
}

var config = require("../config.json")

module.exports = async function(){
    var serverstr = await modules.discordClient.guilds.cache.first()
    
    serverstr.channels.cache.forEach(async channel => {
        if(channel.parentID == config.discord.guild.usersChannelsCategory && channel.id != config.discord.guild.newChannelsChannel){
            if(channel.messages){
                try {
                    var lastMessage = (await channel.messages.fetch({limit: 1})).first()
                    var weekAgo = new Date() 
                    weekAgo.setHours(weekAgo.getHours() - 168)
                    if(lastMessage.createdAt < weekAgo){
                        channel.delete()
                    }
                }catch{}
            }
        }
    })
}