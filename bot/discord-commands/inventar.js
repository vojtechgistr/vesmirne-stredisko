var modules = require("../modules")

var npmmodules = require("../npm-modules")

var discordEmbeds = require("../discord-embeds")

var config = require("../config.json")

module.exports = {
    permissions: [],
    prefixes: ["inventar", "inventář", "staty"],
    execute: async function(message, databaseUser){

        var user = databaseUser._id
        var user2

        if(message.mentions.members.first()) {
            user = await modules.getIDFromDiscordID(message.mentions.members.first().user.id)
        } else {
            user = databaseUser._id
        }

        const items = await modules.mongodb.collections.items.find({user_id: user}).toArray()

        var ownedItems = {}

        items.forEach(item => {
            ownedItems[item.item_id] = (ownedItems[item.item_id] || 0) + item.count
        })



        if(message.mentions.members.first()) {
            var inventoryEmbed = new npmmodules.Discord.MessageEmbed()
            .setColor(config.colors[0])
            .setTitle(`🛍️ Inventář uživatele ${message.mentions.members.first().user.username} 🛍️`)

        Object.keys(ownedItems).forEach(async ownedItem => {
            if(ownedItems[ownedItem] === 0)
                return

            var itemInfo = config.items[ownedItem]
            if(itemInfo.emoji === undefined) return
            await inventoryEmbed.addField(`\`${ownedItem}\`) ${itemInfo.emoji} ${itemInfo.name} ${itemInfo.emoji}`, `Množství - *${ownedItems[ownedItem]}*\nPodrobnosti - \`${config.discord.bot.prefix}položka ${ownedItem}\``)
        })
        if(!ownedItems[0]){
            inventoryEmbed.setDescription(`Uživatel ${message.mentions.members.first().user.username} nemá žádné položky v inventáři`)
        }
        await message.reply(inventoryEmbed)



        } else {

            var inventoryEmbed = new npmmodules.Discord.MessageEmbed()
            .setColor(config.colors[0])
            .setTitle("🛍️ Inventář 🛍️")

        Object.keys(ownedItems).forEach(async ownedItem => {
            if(ownedItems[ownedItem] === 0)
                return

            var itemInfo = config.items[ownedItem]
            if(itemInfo.emoji === undefined) return
            await inventoryEmbed.addField(`\`${ownedItem}\`) ${itemInfo.emoji} ${itemInfo.name} ${itemInfo.emoji}`, `Množství - *${ownedItems[ownedItem]}*\nPodrobnosti - \`${config.discord.bot.prefix}položka ${ownedItem}\``)
        })
        if(!ownedItems[0]){
            inventoryEmbed.setDescription("Nemáš žádné položky")
        }

        await message.reply(inventoryEmbed)
        }

    }
}