var modules = require("../modules")

var npmmodules = require("../npm-modules")

var discordEmbeds = require("../discord-embeds")

var config = require("../config.json")

module.exports = {
    permissions: [],
    prefixes: ["položky", "polozky"],
    execute: async function(message, databaseUser){

        var itemsString = "Pro zobrazení podrobností o položce napiš `" + config.discord.bot.prefix + "polozka [id položky]`\n"

        modules.itemsArray.forEach(item => {
            if(item.helpRequestRoom)
                return
            itemsString += `\`${item.id}\`) ${item.emoji} ${item.name} ${item.emoji}\n`
        })
        
        var embed = new npmmodules.Discord.MessageEmbed()
            .setColor(config.colors[0])
            .setTitle("🧆 Všechny položky 🧆")
            .setDescription(itemsString)


        message.reply(embed)

    }
}