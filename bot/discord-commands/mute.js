var modules = require("../modules")

var npmmodules = require("../npm-modules")

var discordEmbeds = require("../discord-embeds")

var config = require("../config.json")

module.exports = {
    roles: [config.discord.guild.moderatorRole],
    prefixes: ["mute", "ztlumit"],
    execute: async function(message, databaseUser){


        if(!message.mentions.members.first()){
            message.reply(discordEmbeds.warning("Neoznačil jsi žádného člena", `Správný formát: \`${config.discord.bot.prefix}mute [ping] <[čas do vypršení varování]> [důvod]\``))
            return
        }

        if(await modules.mongodb.collections.mutes.findOne({user_id: await modules.getIDFromDiscordID(message.mentions.members.first().user.id), expiresIn: {$gt: new Date()}})){
            message.reply(discordEmbeds.warning("Člen je již ztlumen"))
            return
        }

        var duration = modules.stringToDuration((message.args.slice(2, -1).join(" ").split("<")[1] || "").split(">")[0])
        var reason = message.args.slice(3).join(' ')
        
        
        if(message.args[2].toLowerCase().includes('m') == true || message.args[2].toLowerCase().includes('s') == true || message.args[2].toLowerCase().includes('h') == true || message.args[2].toLowerCase().includes('d') == true){
            
            if((message.args[2].toLowerCase()).includes('m') == true) {
                duration.add(parseInt(message.args[2]), "minutes")

            } else if((message.args[2].toLowerCase()).includes('s') == true) {
                duration.add(parseInt(message.args[2]), "seconds")
                
            }else if((message.args[2].toLowerCase()).includes('d') == true) {
                duration.add(parseInt(message.args[2]), "days")
            } else {
                duration.add(parseInt(message.args[2]), "hours")
            }


        } else {
            reason = message.args.slice(3).join(' ')
            
            duration.add(1, "days")

            reason = message.args.slice(3).join(' ')            

        }
        

        if(!reason) {
            var reason = "Bez důvodu"
        }

        var expiresIn = new Date(new Date().getTime() + duration.asMilliseconds())

        var embed = new npmmodules.Discord.MessageEmbed()
            .setColor("#ff0000")
            .setTitle(`🛡️ Člen ${message.mentions.members.first().user.tag} byl ztlumen 🛡️`)
            .addField("👨 Člen", `<@${message.mentions.members.first().user.id}>`)
            .addField(":stopwatch: Na dobu", duration.humanize())
            .addField("⚔️ Moderátor", `<@${message.author.id}>`)
            .setFooter("Vyprší")
            .setTimestamp(expiresIn)

        if(reason) embed.addField("✴️ Důvod", reason)


        var member = await modules.mongodb.collections.mutes.find({user_id: await modules.getIDFromDiscordID(message.mentions.members.first().user.id)}).toArray()


        if(!member) {
            modules.mongodb.collections.mutes.insertOne({user_id: await modules.getIDFromDiscordID(message.mentions.members.first().user.id), expiresIn: expiresIn, reason: reason})
            message.delete()
            var muterole = await message.guild.roles.cache.get(config.discord.guild.muteRole)
            message.mentions.members.first().roles.add(muterole)
            return message.channel.send(embed)

        } else {
            await modules.mongodb.collections.mutes.updateOne({user_id: await modules.getIDFromDiscordID(message.mentions.members.first().user.id)}, {$set: {expiresIn: expiresIn, reason: reason, unmuted: false}})
            message.delete()
            var muterole = await message.guild.roles.cache.get(config.discord.guild.muteRole)
            message.mentions.members.first().roles.add(muterole)
            return message.channel.send(embed)
        }
        
    
    }
}