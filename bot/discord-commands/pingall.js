var modules = require("../modules")

var npmmodules = require("../npm-modules")

var discordEmbeds = require("../discord-embeds")

var config = require("../config.json")

module.exports = {
    roles: [],
    prefixes: ["pingall"],
    execute: async function(message, databaseUser){
        
        if(message.channel.parentID != config.discord.guild.usersChannelsCategory){
            message.reply(discordEmbeds.warning("Tento příkaz může být použit pouze v kanálech v kategorii `Vaše kanály`"))
            return
        }

        var messageContent = ""
        message.channel.permissionOverwrites.forEach(permission => {
            if(permission.allow.bitfield > 0){
                if(permission.type == "member")
                    messageContent += "<@" + permission.id + "> "
            }
        })

        var newMessage = await message.channel.send(messageContent)
        newMessage.delete()

    }
}