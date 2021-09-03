var npmmodules = require("../npm-modules")

var config = require("../config.json")

module.exports = function(itemID, itemPrice, count){
    var embed = new npmmodules.Discord.MessageEmbed()
        .setColor(config.colors[0])
        .setTitle(`☑️ Prodal jsi ${count} ${config.items[itemID].name} ☑️`)
        .addField(`➕ Bylo ti přidáno ➕`, itemPrice + " G$")
        .addField("🛍️ Počet 🛍️", count)
        
    return embed
}