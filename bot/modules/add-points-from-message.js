var cooldowns = {}

var modules = {
    mongodb: require("./mongodb"),
    itemsArray: require("./items-array"),
    haveItem: require("./have-item")
}

module.exports = async function(userID, message){
    if(new Date() - (cooldowns[userID] || 0) > 60000){

        cooldowns[userID] = new Date()

        var count = 5;

        var itemsMultipliingIncome = modules.itemsArray.filter(item => item.addMoneyFromMessage !== undefined)

        for(var i = 0; i < itemsMultipliingIncome.length; i++){
            let have = await modules.haveItem(userID, itemsMultipliingIncome[i].id)
            count = count + (have * itemsMultipliingIncome[i].addMoneyFromMessage)                
        }

        const fraction = await modules.mongodb.collections.frakce.find({user_id: message.author.id}).toArray()
        var type

        if(fraction.length < 1) {
            await modules.mongodb.collections.frakce.insertOne({user_id: message.author.id, type: "free", messageCount: null, lastMessage: new Date(), claimedDaily: false, leaveDate: "never"})
        }

        fraction.forEach(data => {
            type = data.type
        })

        if(type === "UMCG") {
            modules.mongodb.collections.items.insertOne({user_id: userID, item_id: 0, count: round(count * 1.1, 2)})
            
        } else {
            modules.mongodb.collections.items.insertOne({user_id: userID, item_id: 0, count: count})
        }

        

    }
}

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}