var modules = require("../modules")

var npmmodules = require("../npm-modules")

var discordEmbeds = require("../discord-embeds")

var config = require("../config.json")

module.exports = {
    roles: [],
    prefixes: ["opustit"],
    execute: async function(message, databaseUser){
        var channelID = message.args[1]
        if(!channelID){
            channelID = message.channel.id
        }

        var channel = modules.discordClient.guilds.cache.first().channels.cache.get(channelID)
        if(!channel || channel.parentID != config.discord.guild.usersChannelsCategory || channel.id == config.discord){
            message.delete()
            var embed = new npmmodules.Discord.MessageEmbed()
                .setColor("#ff0000")
                .setTitle(":x: Kanál neexistuje :x:")
                .setDescription("Správný formát: `" + config.discord.bot.prefix + "opustit [ID kanálu]`")
            message.reply(embed)
            return
        }
        var userPermissions = channel.permissionOverwrites.get(message.author.id)
        if(userPermissions && userPermissions.allow.bitfield == 1040){
            message.delete()
            var embed = new npmmodules.Discord.MessageEmbed()
                .setColor("#ff0000")
                .setTitle(":x: Tento kanál nemůžeš opustit :x:")
                .setDescription("Tento kanál nemůžeš opustit, jelikož jsi majitel.\nMužeš ovšem kanál smazat.")
            message.reply(embed)
            return
        }
        channel.updateOverwrite(message.author.id, {
            VIEW_CHANNEL: false
        })
        message.delete()
        var embed = new npmmodules.Discord.MessageEmbed()
            .setColor(config.colors[0])
            .setTitle(":octagonal_sign: " + message.author.tag + " opustil kanál :octagonal_sign:")
        if(channel.type == "text"){
            channel.send(embed)
        }

    }
}