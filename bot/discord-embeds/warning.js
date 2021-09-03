var npmmodules = require("../npm-modules")

module.exports = function(title, description = undefined, fields = []){
    var embed = new npmmodules.Discord.MessageEmbed()
        .setColor("#ff0000")
        .setTitle(`❌ ${title} ❌`)
        .addFields(fields)

    if(description)
        embed.setDescription(description)

    return embed
}