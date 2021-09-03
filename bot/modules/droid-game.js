var modules = {
    discordClient: require('./discord-client'),
    haveItem: require('./have-item'),
    mongodb: require('./mongodb'),
    getIDFromDiscordID: require('./get-id-from-discord-id')
}

var discordEmbeds = require("../discord-embeds")

var config = require('../config.json')

module.exports = async function(){
    return new Promise(async resolve => {
        var message = await modules.discordClient.guilds.cache.first().channels.cache.get(config.discord.guild.droidGameChannel).send("https://media1.tenor.com/images/78b3003b4444eb28f3942c465492fb16/tenor.gif?itemid=15588667")
        message.react("🔫")
    
        const filter = (reaction, user) => {
            return reaction.emoji.name === '🔫' && user.id != modules.discordClient.user.id;
        };
    
        const collector = message.createReactionCollector(filter, { time: 600000 });
    
        var completed = false;
    
        collector.on("collect", async (reaction, user) => {
            var userID = await modules.getIDFromDiscordID(user.id)
            var bullets = await modules.haveItem(userID, 6)
            if(bullets <= 0){
                var warning = await modules.discordClient.guilds.cache.first().channels.cache.get(config.discord.guild.droidGameChannel).send(discordEmbeds.warning("Nemáš nabito", "Nabij si pomocí `" + config.discord.bot.prefix + "nabít`"))
                setTimeout(() => {
                    warning.delete()
                }, 3000);
                return;
            }
            completed = true
            collector.stop()
            message.edit(`<@${user.id}>, Děkujeme za zabití toho droida. Tady máš od nás 15 G$!`)
            modules.mongodb.collections.items.insertMany([{user_id: userID, item_id: 6, count: -1}, {user_id: userID, item_id: 0, count: 15}])
        })
    
        collector.on("end", collected => {
            if(!completed) {
                message.delete().catch(() => {})
            }
            resolve()
        })
    })
}