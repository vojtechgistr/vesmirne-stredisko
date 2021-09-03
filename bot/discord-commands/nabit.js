var modules = require("../modules")

var npmmodules = require("../npm-modules")

var discordEmbeds = require("../discord-embeds")

var config = require("../config.json")

module.exports = {
    permissions: [],
    prefixes: ["nabit", "nabít"],
    execute: async function(message, databaseUser){

        var iron = await modules.haveItem(databaseUser._id, 1)

        if(iron <= 0){
            message.reply(discordEmbeds.warning("Na toto nemáš dostatek železa"))
            return
        }

        var newMessage = await message.reply(new npmmodules.Discord.MessageEmbed().setImage("https://media1.tenor.com/images/8041f5ddd41737a8d8de3c4806158e19/tenor.gif").setColor(config.colors[0]).setTitle("Máš nabito!"))

        setTimeout(() => {
            message.delete()
            newMessage.delete()
        }, 3000);

        modules.mongodb.collections.items.insertMany([{user_id: databaseUser._id, item_id: 6, count: 1}, {user_id: databaseUser._id, item_id: 1, count: -1}])

    }
}