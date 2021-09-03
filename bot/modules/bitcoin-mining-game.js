var npmmodules = require("../npm-modules")

var modules = {
    discordClient: require("./discord-client"),
    getIDFromDiscordID: require("./get-id-from-discord-id"),
    mongodb: require("./mongodb")
}

var config = require("../config.json")

module.exports = async function(){
    return new Promise(async(resolve) => {
        var numbers = []
        var baseNumber = Math.ceil(Math.random() * 24);
        var secundNumber = Math.ceil(Math.random() * 5 + 1);
        var mark = Math.ceil(Math.random() * 2);
        for(var i = 0; i < 6; i++){
            if(mark == 1)
                numbers.push((numbers[numbers.length - 1] || 0) + baseNumber)
            if(mark == 2)
                numbers.push((numbers[numbers.length - 1] || 1) * secundNumber)
        }

        
        var message = await modules.discordClient.guilds.cache.first().channels.cache.get(config.discord.guild.bitcoinGameChannel).send(`Doplň řadu dalšími třemi čísly oddělenými mezerou\n\`${numbers.slice(0, 3).join(" ")}\``)
        const collector = await modules.discordClient.guilds.cache.first().channels.cache.get(config.discord.guild.bitcoinGameChannel).createMessageCollector(message => message.author.id != modules.discordClient.user.id, { time: 600000 });
        var completed = false
        collector.on('collect', async message => {
            var usersNumbers = []
            var success = true
            for(var i = 0; i < message.content.split(" ").length; i++){
                if(message.content.split(" ").length < 3)
                    success = false
                if(message.content.split(" ")[i] != numbers[i + 3])
                    success = false
            }
            if(!success){
                message.react("❌")
                setTimeout(() => {
                    message.delete()
                }, 3000);
                return
            }

            completed = true
            collector.stop()
               
            var databaseUser = await modules.mongodb.collections.users.findOne({discord_id: message.author.id})    
        
            if(!databaseUser){
                await modules.mongodb.collections.users.insertOne({discord_id: message.author.id})
                databaseUser = await modules.mongodb.collections.users.findOne({discord_id: message.author.id})   
            }
            
            var reward = secundNumber
            if(mark == 2)
                reward = reward * 3


            const fraction = await modules.mongodb.collections.frakce.find({user_id: message.author.id}).toArray()
            var type
    
            if(fraction.length < 1) {
                await modules.mongodb.collections.frakce.insertOne({user_id: message.author.id, type: "free", messageCount: null, lastMessage: new Date(), claimedDaily: false, leaveDate: "never"})
            }
    
            fraction.forEach(data => {
                type = data.type
            })

            if(type === "Cryptos") {
                reward = round(secundNumber * 1.25, 1)

                modules.mongodb.collections.items.insertOne({user_id: databaseUser._id, item_id: 5, count: reward})
                message.inlineReply(`Získal jsi \`${reward}\` **(+25% Cryptos)** Bitcoinů!\nČekání na další transakci...`)

            } else {
                modules.mongodb.collections.items.insertOne({user_id: databaseUser._id, item_id: 5, count: reward})
                message.inlineReply(`Získal jsi \`${reward}\` Bitcoinů!\nČekání na další transakci...`)
            }

        })
        collector.on('end', collected => {
            if(!completed)
                message.delete()
            resolve()
        })
    })
}

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}