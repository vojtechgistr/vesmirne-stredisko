var modules = require("../modules")

var npmmodules = require("../npm-modules")

var discordEmbeds = require("../discord-embeds")

var config = require("../config.json")
const e = require("express")

module.exports = {
    roles: [config.discord.guild.moderatorRole],
    prefixes: ["trest-historie", "tresthistorie", "historietrest", "historie-trest"],
    execute: async function(message, databaseUser){
            
    // checking if member is mentioned
        if(!message.mentions.members.first()){
            message.reply(discordEmbeds.warning("Neoznačil jsi žádného člena", `Správný formát: \`${config.discord.bot.prefix}trest-historie [ping]\``))
            return
        } else {
                const punishments = await modules.mongodb.collections.trests.find({user_id: await modules.getIDFromDiscordID(message.mentions.members.first().user.id)}).toArray()

                var everyPunishments = {}

                // punishmenty
                punishments.forEach(punishment => {
                    everyPunishments[punishment.number] = (everyPunishments[punishment.number] || punishment.reason)
                })
                console.log(everyPunishments)

                // aktuální počet trestů
                punishments.forEach(number => {
                    count = parseInt(number.number) || 0
                })

                var endEmbed = new npmmodules.Discord.MessageEmbed()
                    .setColor(config.colors[0])
                    .setTitle("🥊 Trestné body 🥊")

                    // getting data to embed
                    if(isEmpty(everyPunishments) === true || everyPunishments.length < 1) {
                        endEmbed.setDescription(`<@${message.mentions.members.first().user.id}> má čistý rejstřík!`)
                    } else {
                // action
                    Object.keys(everyPunishments).forEach(everyPunish => {
                        if(everyPunish === 0) {
                            endEmbed.setDescription(`<@${message.mentions.members.first().user.id}> byl nejspíše hodný, má **0** trestných bodů!\n`)
                            endEmbed.addField(`__Počet bodů__ - \`${everyPunish}\``, `Důvod - *${everyPunishments[everyPunish]}*`)
                        } else {
                            endEmbed.addField(`__Počet bodů__ - \`${everyPunish}\``, `Důvod - *${everyPunishments[everyPunish]}*`)
                            endEmbed.setDescription(`Aktuální počet udělených trestů a odpuštění je **${punishments.length}**\nAktuální počet udělených trestných bodů je **${everyPunish}**\n`)
                        }
                })
            }

            return message.reply(endEmbed)
        }
    }
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}