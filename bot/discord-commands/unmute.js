var modules = require("../modules")

var npmmodules = require("../npm-modules")

var discordEmbeds = require("../discord-embeds")

var config = require("../config.json")

module.exports = {
    roles: [config.discord.guild.moderatorRole],
    prefixes: ["unmute"],
    execute: async function(message, databaseUser){


        if(!message.mentions.members.first()){
            message.reply(discordEmbeds.warning("Neoznačil jsi žádného člena", `Správný formát: \`${config.discord.bot.prefix}unmute [ping] [důvod]\``))
            return
        }

        if(await modules.mongodb.collections.mutes.findOne({user_id: await modules.getIDFromDiscordID(message.mentions.members.first().user.id), expiresIn: {$gt: new Date()}})){

            var reason = message.args.slice(3).join(' ')
                
                if(!reason) {
                    var reason = "Bez důvodu"
                }

                var embed = new npmmodules.Discord.MessageEmbed()
                    .setColor("#ff0000")
                    .setTitle(`🛡️ Člen ${message.mentions.members.first().user.tag} dostal unmnute 🛡️`)
                    .addField("👨 Člen", `<@${message.mentions.members.first().user.id}>`)
                    .addField("⚔️ Moderátor", `<@${message.author.id}>`)

                if(reason) embed.addField("✴️ Důvod", reason)

                message.delete()
                var muterole = await message.guild.roles.cache.get(config.discord.guild.muteRole)
                message.mentions.members.first().roles.remove(muterole)
                message.channel.send(embed)

                await modules.mongodb.collections.mutes.updateOne({user_id: await modules.getIDFromDiscordID(message.mentions.members.first().user.id)}, {$set: {expiresIn: new Date(), unmuted: true}})

        } else {
            message.reply(discordEmbeds.warning("Člen není ztlumen."))
            return
        }

    }
}