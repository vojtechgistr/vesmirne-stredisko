var modules = require("../modules")

var npmmodules = require("../npm-modules")

var discordEmbeds = require("../discord-embeds")

var config = require("../config.json")

module.exports = {
    permissions: [],
    prefixes: ["koupit", "zakoupit"],
    execute: async function(message, databaseUser){
        
        var selectedItem = config.items[message.args[1]]

        var count = 1

        const fraction = await modules.mongodb.collections.frakce.find({user_id: message.author.id}).toArray()
        var type

        if(fraction.length < 1) {
            await modules.mongodb.collections.frakce.insertOne({user_id: message.author.id, type: "free", messageCount: null, lastMessage: new Date(), claimedDaily: false, leaveDate: "never"})
        }

        fraction.forEach(data => {
            type = data.type
        })

        if(Number(message.args[2]) && Number(message.args[2]) > 0)
            count = Math.round(Number(message.args[2]))


        if(!selectedItem){
            message.reply(discordEmbeds.warning("Položka s tímto ID nenalezena"))
            return
        }

        if(!selectedItem.price && selectedItem.price !== 0){
            message.reply(discordEmbeds.warning("Tento předmět nelze koupit"))
            return
        }

        if(selectedItem.type == "Oprávnění" && await modules.haveItem(databaseUser._id, message.args[1]) > 0){
            message.reply(discordEmbeds.warning("Toto oprávnění již vlastníš"))
            return
        }


        var price = selectedItem.price * count

        if(selectedItem.doublePrice){
            price = selectedItem.price
            count = 1
            var ownedItems = await modules.haveItem(databaseUser._id, message.args[1])
            for(var i = 0; i < ownedItems; i++){
                price = price * 2
            }
        }

        const canWardens = [100, 101, 102, 103, 104, 105, 106, 107]

        if(type === "Futura" && Number(selectedItem.id) === 106 || type === "Futura" && Number(selectedItem.id) === 206) {
            price = Math.ceil(price * 0.8)
            
        } else if(type === "The Wardens" && canWardens.includes(Number(selectedItem.id))) {
            price = Math.ceil(price * 0.9)
        }

        var usersFunds = await modules.countPoints(databaseUser._id)
        if(usersFunds < price){
            message.reply(discordEmbeds.notEnougthFunds(price, usersFunds))
            return
        }

        if(selectedItem.requirements){
            for(var i = 0; i < selectedItem.requirements.length; i++){
                if(await modules.haveItem(databaseUser._id, selectedItem.requirements[i]) < 1){
                    message.reply(discordEmbeds.warning("Nesplňuješ podmínky", "K zakoupení této položky potřebuješ mít již zakoupenou jinou položku", [{name: "Požadovaná položka", value: `${config.items[selectedItem.requirements[i]].emoji} ${config.items[selectedItem.requirements[i]].name} ${config.items[selectedItem.requirements[i]].emoji}`}]))
                    return
                }
            }
        }

        if(selectedItem.addRole)
            message.member.roles.add(selectedItem.addRole)
        console.log(price)
        await modules.mongodb.collections.items.insertMany([{user_id: databaseUser._id, item_id: Number(message.args[1]), count: count}, {user_id: databaseUser._id, item_id: 0, count: price * -1}])

        message.reply(discordEmbeds.purchase(message.args[1], price, usersFunds, count))

    }
}