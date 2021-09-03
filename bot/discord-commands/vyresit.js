var modules = require("../modules")

var npmmodules = require("../npm-modules")

var discordEmbeds = require("../discord-embeds")

var config = require("../config.json")

module.exports = {
    roles: [config.discord.guild.helperRole],
    prefixes: ["vyresit", "vyřešit"],
    execute: async function(message, databaseUser){
        
        if(message.channel.parentID != config.discord.guild.helpCategory || message.channel.id == config.discord.guild.helpRoom)
            return

        message.channel.overwritePermissions([
            {
                id: message.guild.id,
                deny: ['VIEW_CHANNEL']
            },
            {
                id: message.channel.topic,
                allow: ['VIEW_CHANNEL'],
                deny: ['SEND_MESSAGES']
            },
        ]);

        var newMessage = await message.channel.send(new npmmodules.Discord.MessageEmbed().setColor(config.colors[0]).setTitle("❓ Tvůj názor ❓").setDescription("Tvůj názor nás zajímá, proto budeme velmi rádi, pokud nám pomocí reakce na tuto zprávu povíš, **jestli byl tvůj problém vyřešen** a jakým způsebem.\nKanál se po přidání reakce automaticky uzavře."))

        newMessage.react("😃")
        newMessage.react("😞")

        var collector = newMessage.createReactionCollector((reaction, user) => (reaction.emoji.name == "😃" || reaction.emoji.name == "😞") && user.id != modules.discordClient.user.id, { time: 600000, max: 1 });

        collector.on("end", collected => {
            message.channel.delete()
        })

        collector.on("collect", async (reaction, user) => {
            var embed = new npmmodules.Discord.MessageEmbed()
                .setColor(config.colors[0])
                .addField("👨 Od člena 👨", `<@${message.channel.topic}>`)
            switch(reaction.emoji.name){
                case "😃":
                    modules.mongodb.collections.items.insertOne({user_id: databaseUser._id, item_id: 1000, count: 1})
                    embed.setTitle("😃 Obdržel jsi pozitivní reakci na pomoc 😃")
                    break
                case "😞":
                    modules.mongodb.collections.items.insertOne({user_id: databaseUser._id, item_id: 1001, count: 1})
                    embed.setTitle("😞 Obdržel jsi negativní reakci na pomoc 😞")
                    break
            }
            modules.discordClient.channels.cache.get(config.discord.guild.helpRequestRoom).send(`<@${message.author.id}>`, {embed: embed})
            collector.stop()
        })
        
    }
}