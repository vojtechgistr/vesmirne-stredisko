var modules = require("../modules")

var npmmodules = require("../npm-modules")

var discordEmbeds = require("../discord-embeds")

var config = require("../config.json")

module.exports = {
    roles: [config.discord.guild.moderatorRole],
    prefixes: ["resetovat-pocitani", "r-p"],
    execute: async function(message, databaseUser){

        if(!message.channel.id === "818932276301266965") {
            return;
        } else {
    
            if(message.author.bot) return
    
                    let usid
                    const counting = await modules.mongodb.collections.counts.find({ido: "1"}).toArray()
        
                    counting.forEach(uid => {
                        usid = uid.user_id
                        count = uid.counting
                    })

                    modules.mongodb.collections.counts.findOneAndUpdate({ido: "1"}, {$set: {user_id: 0, counting: 0}})
        }

    }
}