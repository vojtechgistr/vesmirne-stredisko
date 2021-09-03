var modules = require("../modules")

var npmmodules = require("../npm-modules")

var discordEmbeds = require("../discord-embeds")

var config = require("../config.json")

module.exports = {
    permissions: [],
    prefixes: ["prodat"],
    execute: async function(message, databaseUser){
        
        var selectedItem = config.items[message.args[1]]

        var count = 1

        if(Number(message.args[2]) && Number(message.args[2]) > 0)
            count = Math.round(Number(message.args[2]))


        if(!selectedItem){
            message.reply(discordEmbeds.warning("Položka s tímto ID nenalezena"))
            return
        }

        if(!selectedItem.sellingPrice && selectedItem.sellingPrice !== 0){
            message.reply(discordEmbeds.warning("Tento předmět nelze prodat"))
            return
        }

        var have = await modules.haveItem(databaseUser._id, Number(message.args[1]))
        if(have < count){
            message.reply(discordEmbeds.warning("Prodáváš větší množství než vlastníš"))
            return
        }

        var price = selectedItem.sellingPrice * count

        await modules.mongodb.collections.items.insertMany([{user_id: databaseUser._id, item_id: Number(message.args[1]), count: count * -1}, {user_id: databaseUser._id, item_id: 0, count: price}])

        message.reply(discordEmbeds.sell(message.args[1], price, count))

    }
}