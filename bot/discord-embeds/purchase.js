var npmmodules = require("../npm-modules")

var config = require("../config.json")

module.exports = function(itemID, itemPrice, usersFunds, count){
    var embed = new npmmodules.Discord.MessageEmbed()
        .setColor(config.colors[0])
        .setTitle(`☑️ ${config.items[itemID].name} ☑️`)
        .setDescription(`Pro zobrazení podrobností o této položce napiš \`${config.discord.bot.prefix}položka ${itemID}\``)
        .addField(":dollar: Zůstatek :dollar:", usersFunds - itemPrice + " G$")
        .addField("🛍️ Počet 🛍️", count)
        
    return embed
}