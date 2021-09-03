var modules = require("../modules")

var npmmodules = require("../npm-modules")

var discordEmbeds = require("../discord-embeds")

var config = require("../config.json")

module.exports = {
    roles: [config.discord.guild.helperRole],
    prefixes: ["predat", "předat"],
    execute: async function(message, databaseUser){
        
        if(message.channel.parentID != config.discord.guild.helpCategory || message.channel.id == config.discord.guild.helpRoom)
            return

        if(!message.mentions.members.first()){
            message.reply(discordEmbeds.warning("Neoznačil jsi žádného člena"))
            return
        }

        message.channel.updateOverwrite(message.mentions.members.first(), {
            VIEW_CHANNEL: true
        })

        var newHelperEmbed = new npmmodules.Discord.MessageEmbed()
            .setColor(config.colors[0])
            .setTitle("❓ Připojil se helper ❓")
            .setDescription("Připojil se helper <@" + message.mentions.members.first().user.id + ">")
        message.channel.send(`<@${message.channel.topic}> <@${message.mentions.members.first().user.id}>`, {embed: newHelperEmbed})
        
    }
}