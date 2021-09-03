var modules = require("../modules")

var npmmodules = require("../npm-modules")

var discordEmbeds = require("../discord-embeds")

var config = require("../config.json")

module.exports = {
    permissions: [],
    prefixes: ["položka", "polozka"],
    execute: async function(message, databaseUser){

        var item = config.items[message.args[1]]

        if(!item){
            message.reply(discordEmbeds.warning("Položka s tímto ID nebyla nalezena"))
            return
        }

        var embed = new npmmodules.Discord.MessageEmbed()
            .setColor(config.colors[0])
            .setTitle(`${item.emoji} (${message.args[1]}) ${item.name} ${item.emoji}`)

        var description = ""

        description += `⌨️ Typ této položky je \`${item.type}\`\n`

        if(item.price !== undefined){
            description += `💵 Tuto položku je možné zakoupit za \`${item.price}\ G$\` pomocí \`${config.discord.bot.prefix}koupit ${message.args[1]}\`\n`
        }

        if(item.doublePrice){
            description += "‼️ Tato položka při každém tvém nákupu zvojnásobí svojí cenu\n"
        }

        if(item.sellingPrice){
            description += `🏪 Tuto položku je možné prodat za \`${item.sellingPrice} G$\` pomocí \`${config.discord.bot.prefix}prodat ${message.args[1]}\`\n`
        }

        if(item.addMoneyFromMessage !== undefined){
            description += `✖️ Tato položka zvýší tvůj příjem za zprávy o \`${item.addMoneyFromMessage} G$\`\n`
        }

        embed.setDescription(description)

        if(item.requirements && item.requirements[0]){
            let requiredItemsString = ""
            item.requirements.forEach(requirement => {
                requiredItemsString += `\`(${requirement}) ${config.items[requirement].name}\`\n`
            })
            embed.addField("📝 Tutu položku můžeš zakoupit pouze pokud vlastníš", requiredItemsString)
        }

        var itemsRequiringItem = modules.itemsArray.filter(item => {
            if(item.requirements)
                return item.requirements.includes(Number(message.args[1]))
            else
                return 0
        })

        var itemsRequiringItemString = ""

        itemsRequiringItem.forEach(itemRequiresItem => {
            itemsRequiringItemString += `\`(${itemRequiresItem.id}) ${itemRequiresItem.name}\`\n`
        })

        if(itemsRequiringItem[0]){
            embed.addField("🔓 Položky, které odemkneš zakoupením této položky", itemsRequiringItemString)
        }

        if(item.hourlyAdds && item.hourlyAdds[0]){
            var hourlyAddsString = ""
            item.hourlyAdds.forEach(hourlyAdds => {
                hourlyAddsString += `${hourlyAdds.count}x \`(${hourlyAdds.id}) ${config.items[hourlyAdds.id].name}\`\n`
            })
            embed.addField("➕ Tento předmět každou hodinu přidává tyto položky do tvého inventáře", hourlyAddsString)
        }

        

        message.reply(embed)

    }
}