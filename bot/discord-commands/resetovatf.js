var modules = require("../modules")

var npmmodules = require("../npm-modules")

var discordEmbeds = require("../discord-embeds")

var config = require("../config.json")

module.exports = {
    roles: [],
    prefixes: ["resetovat-fotbal", "r-f"],
    execute: async function(message, databaseUser){

        if(!message.channel.id === "834014237893459969") {
            return;
        } else {
    
            if(message.author.bot) return
    
                    let usid
                    const fotball = await modules.mongodb.collections.fotbal.find({ido: "1"}).toArray()
        
                    fotball.forEach(data => {
                        usid = data.user_id
                        lastChar = data.lastCharacter
                    })

                    modules.mongodb.collections.fotbal.findOneAndUpdate({ido: "1"}, {$set: {user_id: 0, lastCharacter: "none"}})
        }

    }
}