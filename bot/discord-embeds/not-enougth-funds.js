var npmmodules = require("../npm-modules")

module.exports = function(itemPrice, usersFunds){
    return new npmmodules.Discord.MessageEmbed()
        .setColor("#ff0000")
        .setTitle("❌ Na toto nemáš dostatek G$ ❌")
        .addField(":dollar: Tvůj aktuální zůstatek :dollar:", usersFunds + " G$")
        .addField(":dollar: Cena položky :dollar:", itemPrice + " G$")
        .addField(":woman_shrugging: Potřebuješ dalších :woman_shrugging:", (itemPrice - usersFunds) + " G$")
}