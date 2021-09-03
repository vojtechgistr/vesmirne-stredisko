var modules = require("../modules")

var npmmodules = require("../npm-modules")

var discordEmbeds = require("../discord-embeds")

var config = require("../config.json")
const { Conv2D } = require("@tensorflow/tfjs")

module.exports = {
    roles: [config.discord.guild.moderatorRole],
    prefixes: ["warn", "varovat"],
    execute: async function(message, databaseUser){
        
        var duration = modules.stringToDuration((message.args.slice(2, message.args.length).join(" ").split("<")[1] || "").split(">")[0])
        
        var reason = ""

        if(!(message.args.slice(2, message.args.length).join(" ").split("<")[1] || "").split(">")[0]){
            duration.add(4, "days")
            reason = message.args.slice(2, message.args.length).join(" ")
        }else{
            reason = message.args.slice(2, message.args.length).join(" ").split(">")[1]
        }

        if(!message.mentions.members.first()){
            message.reply(discordEmbeds.warning("Neoznačil jsi žádného člena", `Správný formát: \`${config.discord.bot.prefix}warn [ping] <[čas do vypršení varování]> [důvod]\``))
            return
        }

        var expiresIn = new Date(new Date().getTime() + duration.asMilliseconds())

        var embed = new npmmodules.Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle(`⚠️ Člen ${message.mentions.members.first().user.tag} byl varován ⚠️`)
            .addField("👨 Člen", `<@${message.mentions.members.first().user.id}>`)
            .addField("⚔️ Moderátor", `<@${message.author.id}>`)
            .setFooter("Vyprší")
            .setTimestamp(expiresIn)

        if(reason)
            embed.addField("✴️ Důvod", reason)

        message.delete()
        message.channel.send(embed)

        await modules.mongodb.collections.warns.insertOne({user_id: await modules.getIDFromDiscordID(message.mentions.members.first().user.id), expiresIn: expiresIn, reason: reason})

        if((await modules.mongodb.collections.mutes.find({user_id: await modules.getIDFromDiscordID(message.mentions.members.first().user.id), expiresIn: {$gt: new Date()}}).toArray()).length > 4 && !await modules.mongodb.collections.mutes.findOne({user_id: await modules.getIDFromDiscordID(message.mentions.members.first().user.id), expiresIn: {$gt: new Date()}})){
            var muteExpiresIn = new Date(new Date().getTime() + 86400000)
            
            var embed = new npmmodules.Discord.MessageEmbed()
                .setColor("#ff0000")
                .setTitle(`🛡️ Člen ${message.mentions.members.first().user.tag} byl ztlumen 🛡️`)
                .addField("👨 Člen", `<@${message.mentions.members.first().user.id}>`)
                .addField("⚔️ Moderátor", `<@${modules.discordClient.user.id}>`)
                .addField("✴️ Důvod", "4 platné varování za poslední 4 dny")
                .setFooter("Vyprší")
                .setTimestamp(muteExpiresIn)

            message.mentions.members.first().roles.add(config.discord.guild.muteRole)
            message.channel.send(embed)

            modules.mongodb.collections.mutes.insertOne({user_id: await modules.getIDFromDiscordID(message.mentions.members.first().user.id), expiresIn: muteExpiresIn, reason: "4 platné varování za poslední 4 dny"})

        }

    }
}