var modules = require("../modules")

var npmmodules = require("../npm-modules")

var discordEmbeds = require("../discord-embeds")

var config = require("../config.json")
const mongodb = require("../modules/mongodb")

module.exports = {
    roles: [config.discord.guild.můstekRole],
    prefixes: ["trest"],
    execute: async function(message, databaseUser){

    // checking if member is mentioned
        if(!message.mentions.members.first()){
            message.reply(discordEmbeds.warning("Neoznačil jsi žádného člena", `Správný formát: \`${config.discord.bot.prefix}trest [ping] [pridat/odebrat/resetovat] [pokud přidat nebo odebrat, počet] [důvod]\``))
            return
        }
        
        var reason = ""
        const punishments = await modules.mongodb.collections.trests.find({user_id: await modules.getIDFromDiscordID(message.mentions.members.first().user.id)}).toArray()
        let count = 0

        punishments.forEach(number => {
            count = parseInt(number.number) || 0
        })
        let enterednumber = parseInt(message.args[3])
        console.log(count)

    // checking if action exists
        if(!message.args[2]) {
                message.reply(discordEmbeds.warning("Nezadal jsi akci, kterou mám provést", `Správný formát: \`${config.discord.bot.prefix}trest [ping] [pridat/odebrat/resetovat] [pokud přidat nebo odebrat, počet] [důvod]\``))
                return
        }
        if(message.args[2] == "pridat" || message.args[2] == "přidat") {

            // check if arg 2 is number
            if(isNaN(message.args[3])) {
                message.reply(discordEmbeds.warning("Nesprávný formát, počet musí být číslo", `Správný formát: \`${config.discord.bot.prefix}trest [ping] pridat [počet trestných bodů] [důvod]\``))
                return
            } else {
                reason = message.args.slice(4).join(" ")
                // check if reason exists
                if(!reason) {
                    message.reply(discordEmbeds.warning("Nesprávný formát, počet musí být číslo", `Správný formát: \`${config.discord.bot.prefix}trest [ping] pridat [počet trestných bodů] [důvod]\``))
                return
                } else {
                    // akce - poslání embed zprávy a přičtení bodů do databáze

                    await modules.mongodb.collections.trests.insertOne({user_id: await modules.getIDFromDiscordID(message.mentions.members.first().user.id), number: count + enterednumber, reason: reason})

                    var embed = new npmmodules.Discord.MessageEmbed()
                    .setColor("#ff0000")
                    .setTitle(`⚠️ Člen ${message.mentions.members.first().user.tag} byl potrestán ⚠️`)
                    .addField("🔴 Uděleno bodů", `${enterednumber}`)
                    .addField("🔴 Aktuální počet bodů", `${count + enterednumber}`)
                    .addField("👨 Člen", `<@${message.mentions.members.first().user.id}>`)
                    .addField("⚔️ Admin", `<@${message.author.id}>`)
                    .addField("✴️ Důvod", reason)
        
                message.delete()
                message.channel.send(embed)

                }
            }

        }else if(message.args[2] == "odebrat") {

            // check if arg 2 is number
            if(isNaN(message.args[3])) {
                message.reply(discordEmbeds.warning("Nesprávný formát, počet musí být číslo", `Správný formát: \`${config.discord.bot.prefix}trest [ping] odebrat [počet trestných bodů] [důvod]\``))
                return
            } else {
                reason = message.args.slice(4).join(" ")
                // check if reason exists
                if(!reason) {
                    message.reply(discordEmbeds.warning("Nesprávný formát, počet musí být číslo", `Správný formát: \`${config.discord.bot.prefix}trest [ping] odebrat [počet trestných bodů] [důvod]\``))
                    return
                } else {
                    // akce - poslání embed zprávy a přičtení bodů do databáze

                    await modules.mongodb.collections.trests.insertOne({user_id: await modules.getIDFromDiscordID(message.mentions.members.first().user.id), number: count - enterednumber, reason: reason})
                    
                    var embed = new npmmodules.Discord.MessageEmbed()
                    .setColor("#ff0000")
                    .setTitle(`⚠️ Člen ${message.mentions.members.first().user.tag} byl nejspíŠe hodný ⚠️`)
                    .addField("🔴 Odebráno bodů", `${enterednumber}`)
                    .addField("🔴 Aktuální počet bodů", `${count - enterednumber}`)
                    .addField("👨 Člen", `<@${message.mentions.members.first().user.id}>`)
                    .addField("⚔️ Admin", `<@${message.author.id}>`)
                    .addField("✴️ Důvod", reason)
        
                message.delete()
                message.channel.send(embed)


                }
            }

        } else if(message.args[2] == "resetovat") {
            // check if arg 2 is number
        
                reason = message.args.slice(3).join(" ")
                // check if reason exists
                if(!reason) {
                    message.reply(discordEmbeds.warning("Nesprávný formát, trest nesmí být bez důvodu", `Správný formát: \`${config.discord.bot.prefix}trest [ping] resetovat [důvod]\``))
                    return
                } else {
                    // akce - poslání embed zprávy a přičtení bodů do databáze
                    await modules.mongodb.collections.trests.insertOne({user_id: await modules.getIDFromDiscordID(message.mentions.members.first().user.id), number: count - count, reason: reason})
                    
                    var embed = new npmmodules.Discord.MessageEmbed()
                    .setColor("#ff0000")
                    .setTitle(`⚠️ Členu ${message.mentions.members.first().user.tag} byl udělen mír ⚠️`)
                    .addField("🔴 Aktuální počet bodů", count - count)
                    .addField("👨 Člen", `<@${message.mentions.members.first().user.id}>`)
                    .addField("⚔️ Admin", `<@${message.author.id}>`)
                    .addField("✴️ Důvod", reason)
        
                message.delete()
                message.channel.send(embed)
                }
            } else {
                message.reply(discordEmbeds.warning("Nezadal jsi akci, kterou mám provést", `Správný formát: \`${config.discord.bot.prefix}trest [ping] [pridat/odebrat/resetovat] [pokud přidat nebo odebrat, počet] [důvod]\``))
                return
            }
    }
}