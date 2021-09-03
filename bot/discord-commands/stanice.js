var modules = require("../modules")

var npmmodules = require("../npm-modules")

var discordEmbeds = require("../discord-embeds")

var config = require("../config.json")

module.exports = {
    permissions: [],
    prefixes: ["stanice"],
    execute: async function(message, databaseUser){

        var stations = {}

        var ownedItems = await modules.mongodb.collections.items.find({user_id: databaseUser._id}).toArray()

        const fraction = await modules.mongodb.collections.frakce.find({user_id: message.author.id}).toArray()
        var type

        if(fraction.length < 1) {
            await modules.mongodb.collections.frakce.insertOne({user_id: message.author.id, type: "free", messageCount: null, lastMessage: new Date(), claimedDaily: false, leaveDate: "never"})
        }

        fraction.forEach(data => {
            type = data.type
        })


        Object.keys(config.items).forEach(key => {
            if(config.items[key].type == "Objekt")
                stations[key] = config.items[key]
        })

        var embed = new npmmodules.Discord.MessageEmbed()
            .setColor(config.colors[0])
            .setTitle("🚀 Seznam vesmírných stanic 🚀")

        Object.keys(stations).forEach(async key => {
            var have = 0
            ownedItems.filter(item => item.item_id == key).forEach(item => {
                have += item.count
            })
            if(have > 0){
                var value = "Tyto stanice již vlastníš"
            }else{
                var value = `Pro zakoupení této stanice napiš \`${config.discord.bot.prefix}koupit ${key}\``
            }

           
            if(type === "Futura" && key === "206") {
                value += `\nCena - \`${Math.ceil(stations[key].price * 0.9)} G$\``
                embed.setThumbnail('https://i.imgur.com/8OV0OEJ.png')
            } else {
                value += `\nCena - \`${stations[key].price} G$\``
            }

            value += `\nDalší informace můžeš zobrazit pomocí \`${config.discord.bot.prefix}polozka ${key}\``

            embed.addField(`${stations[key].emoji} ${stations[key].name} ${stations[key].emoji}`, value)
        })

        message.reply(embed)

    }
}