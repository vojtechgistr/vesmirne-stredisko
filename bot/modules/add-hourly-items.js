var modules = {
    itemsArray: require("./items-array"),
    mongodb: require("./mongodb"),
    haveItem: require("./have-item"),
    getDiscordIDFromID: require("./get-discord-id-from-id")
}

module.exports = function(){
    var hourlyAddingItems = modules.itemsArray.filter(item => {
        if(item.hourlyAdds && item.hourlyAdds[0])
            return 1
        else
            return 0
    })

    function round(value, precision) {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }

    var hourlyAddingItemsIDs = [] 

    hourlyAddingItems.forEach(item => {
        hourlyAddingItemsIDs.push({item_id: item.id})
    })

    var adding = []

    var type
    var fraction

    modules.mongodb.collections.items.find({$or:hourlyAddingItemsIDs}).toArray().then(async data => {

        for(var i = 0; i < data.length; i++){

            var Item = hourlyAddingItems.find(Item1 => Item1.id == data[i].item_id)

            for(var y = 0; y < Item.hourlyAdds.length; y++){

                fraction = await modules.mongodb.collections.frakce.find({user_id: await modules.getDiscordIDFromID(data[i].user_id)}).toArray()
                
                if(fraction.length < 1) {
                    await modules.mongodb.collections.frakce.insertOne({user_id: data[i].user_id.toString(), type: "free", messageCount: null, lastMessage: new Date(), claimedDaily: false, leaveDate: "never"})
                }
            
                await fraction.forEach(data2 => {
                    type = data2.type
                })



                if(!adding.find(element => element.user_id.toString() == data[i].user_id.toString() && element.item_id == Item.hourlyAdds[y].id)) {

                    adding.push({user_id: data[i].user_id, item_id: Item.hourlyAdds[y].id, count: 0})


                }

                    if(type == "Terraq" && Item.hourlyAdds[y].id == 1 || type == "Terraq" && Item.hourlyAdds[y].id == 2 || type == "Terraq" && Item.hourlyAdds[y].id == 3) {
                        var haveZelezo = await modules.haveItem(data[i].user_id, 201)
                        var haveSira = await modules.haveItem(data[i].user_id, 203)
                        var haveVodik = await modules.haveItem(data[i].user_id, 205)


                        if(haveZelezo > 0 && haveSira > 0 && haveVodik > 0) {

                            adding.find(element => element.user_id.toString() == data[i].user_id.toString() && element.item_id == Item.hourlyAdds[y].id).count += round(Item.hourlyAdds[y].count * data[i].count * 1.25, 1)

                        } else if(haveZelezo > 0 && haveSira > 0) {

                            adding.find(element => element.user_id.toString() == data[i].user_id.toString() && element.item_id == Item.hourlyAdds[y].id).count += round(Item.hourlyAdds[y].count * data[i].count * 1.15, 1)

                        } else if(haveZelezo > 0) {

                            adding.find(element => element.user_id.toString() == data[i].user_id.toString() && element.item_id == Item.hourlyAdds[y].id).count += round(Item.hourlyAdds[y].count * data[i].count * 1.1, 1)

                        }


                    } else {
                        adding.find(element => element.user_id.toString() == data[i].user_id.toString() && element.item_id == Item.hourlyAdds[y].id).count += round(Item.hourlyAdds[y].count * data[i].count * 1, 1)
                    }
                    
            }
        }
        await modules.mongodb.collections.items.insertMany(adding)
    })
}