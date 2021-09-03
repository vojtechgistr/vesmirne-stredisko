var modules = require("../modules")

var npmmodules = require("../npm-modules")

var discordEmbeds = require("../discord-embeds")

var config = require("../config.json")

module.exports = {
    roles: [],
    prefixes: ["pripojit", "připojit"],
    execute: async function(message, databaseUser){
        
        if(!message.args[1]){
            message.delete()
            var embed = new npmmodules.Discord.MessageEmbed()
                .setColor("#ff0000")
                .setTitle(":x: Nenapsal jsi ID kanálu :x:")
                .setDescription("Správný formát: `" + config.discord.bot.prefix + "připojit [ID kanálu]`")
            message.reply(embed)
            return
        }
        var channel = modules.discordClient.guilds.cache.first().channels.cache.get(message.args[1])
        if(!channel || channel.parentID != config.discord.guild.usersChannelsCategory || channel.id == config.discord){
            message.delete()
            var embed = new npmmodules.Discord.MessageEmbed()
                .setColor("#ff0000")
                .setTitle(":x: Kanál neexistuje :x:")
                .setDescription("Správný formát: `" + config.discord.bot.prefix + "připojit [ID kanálu]`")
            message.reply(embed)
            return
        }
        channel.updateOverwrite(message.author.id, {
            VIEW_CHANNEL: true
        })
        var embed = new npmmodules.Discord.MessageEmbed()
            .setColor(config.colors[0])
            .setTitle(":new: Byl jsi přidán do kanálu :new:")
            .addField(":octagonal_sign: Opuštění :octagonal_sign:", "Pro opuštění napiš do jakéhokoli kanálu `" + config.discord.bot.prefix + "opustit " + channel.id + "`")
        message.delete()
        message.member.send(embed)
        var embed = new npmmodules.Discord.MessageEmbed()
            .setColor(config.colors[0])
            .setTitle(":new: Připojil se nový člen :new:")
            .addField(":octagonal_sign: Opuštění :octagonal_sign:", "Pro opuštění kanálu napiš do kanálu `" + config.discord.bot.prefix + "opustit`")
        if(channel.type == "text"){
            channel.send(embed)
        }

    }
}