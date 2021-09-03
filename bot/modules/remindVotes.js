var modules = {
    mongodb: require("./mongodb"),
    discordClient: require("./discord-client"),
    getDiscordIDFromID: require("./get-discord-id-from-id")
}

var npmmodules = require("../npm-modules")

module.exports = async function(){
    var time12hago = new Date()
    time12hago.setTime(new Date().getTime() - (12*60*60*1000))
    var votes = await modules.mongodb.collections.votes.find({date: {$lt: time12hago}, $or:[{reminded: false}, {reminded: undefined}]}).toArray()
    votes.forEach(async vote => {
        if(!vote.stuart){
            var embed = new npmmodules.Discord.MessageEmbed()
                .setColor("#ffd700")
                .setTitle("🗳️ Tvůj hlas vypršel 🗳️")
                .setDescription("Tvůj hlas na https://stredisko.space/vote vypršel.\nNyní můžeš hlasovat a znovu dostat 200 G$.")
            if(modules.discordClient.guilds.cache.first().members.cache.get(await modules.getDiscordIDFromID(vote.user_id))){
                modules.discordClient.guilds.cache.first().members.cache.get(await modules.getDiscordIDFromID(vote.user_id)).send(embed).catch(() => {})
            }
            await modules.mongodb.collections.votes.updateOne({_id: vote._id}, {$set: {reminded: true}})
        }else{
            var embed = new npmmodules.Discord.MessageEmbed()
                .setColor("#ffd700")
                .setTitle("🗳️ Tvůj hlas vypršel 🗳️")
                .setDescription("Tvůj hlas na https://stuartbot.fun vypršel.\nNyní můžeš hlasovat a znovu dostat 100 G$.")
            if(modules.discordClient.guilds.cache.first().members.cache.get(await modules.getDiscordIDFromID(vote.user_id))){
                modules.discordClient.guilds.cache.first().members.cache.get(await modules.getDiscordIDFromID(vote.user_id)).send(embed).catch(() => {})
            }
            await modules.mongodb.collections.votes.updateOne({_id: vote._id}, {$set: {reminded: true}})
        }
    })
}