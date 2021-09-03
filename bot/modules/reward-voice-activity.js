var modules = {
    mongodb: require("./mongodb"),
    discordClient: require("./discord-client"),
    getIDFromDiscordID: require("./get-id-from-discord-id")
}

var npmmodules = require("../npm-modules")

var config = require("../config.json")

module.exports = async function(){
    await Promise.all(modules.discordClient.guilds.cache.first().voiceStates.cache.map(voiceState => {
        return new Promise(async resolve => {
            if(!voiceState.channel){
                resolve(voiceState)
                return
            }
                
    
            if(voiceState.selfMute || voiceState.serverMute){
                resolve(voiceState)
                return
            }
        
            if(voiceState.member.user.bot){
                resolve(voiceState)
                return
            }
                
            if(!modules.discordClient.guilds.cache.first().voiceStates.cache.find(state => {return state.channel == voiceState.channelID && state.id != voiceState.id && !state.member.user.bot && !state.selfMute && !state.serverMute})){
                resolve(voiceState)
                return
            }
        
            if(voiceState.channel.parentID == config.discord.guild.usersChannelsCategory){
                resolve(voiceState)
                return
            }
        
            var oldState = await modules.mongodb.collections.activeVoiceTicks.findOne({_id: voiceState.id})
            
            if(!oldState){
                await modules.mongodb.collections.activeVoiceTicks.insertOne({_id: voiceState.id, value: 1}).catch(() => {})
            }else{
                await modules.mongodb.collections.activeVoiceTicks.updateOne({_id: voiceState.id}, {$set: {value: oldState.value + 1}})
            }

            resolve(voiceState)
        })
        
    }))
    var activeTicks = await modules.mongodb.collections.activeVoiceTicks.find({}).toArray()
    activeTicks.forEach(async voiceState => {
        if(!modules.discordClient.guilds.cache.first().voiceStates.cache.find(voice => {return voice.id == voiceState._id && voice.channelID})){
            if(!await modules.getIDFromDiscordID(voiceState._id)){
                await modules.mongodb.collections.users.insertOne({discord_id: voiceState._id})
            }
            
            await modules.mongodb.collections.activeVoiceTicks.deleteOne({_id: voiceState._id})
            modules.mongodb.collections.items.insertOne({user_id: await modules.getIDFromDiscordID(voiceState._id), count: voiceState.value * 0.5, item_id: 0})
            if(voiceState.value * 0.5 > 50){
                var embed = new npmmodules.Discord.MessageEmbed()
                    .setColor(config.colors[0])
                    .setTitle(":microphone: Děkujeme za aktivitu :microphone:")
                    .setDescription(":dollar: Právě jsi za aktivitu ve voice kanálu dostal " + voiceState.value * 0.5 + " G$.\nVelmi ti děkujeme za tvoji aktivitu. :heart:")
                if(modules.discordClient.guilds.cache.first().members.cache.get(voiceState._id))
                    modules.discordClient.guilds.cache.first().members.cache.get(voiceState._id).send(embed).catch(() => {})
            }
            
        }
    })
}