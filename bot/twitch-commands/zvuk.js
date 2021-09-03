var modules = require("../modules")

var npmmodules = require("../npm-modules")

var config = require("../config.json")

var cooldowns = {}

module.exports = {
    requiresLogin: true,
    prefixes: ["zvuk"],
    execute: async function(target, context, msg, self, databaseUser, args){

        var points = modules.haveItem(databaseUser._id, 0)

        var sound = await modules.mongodb.collections.streamSounds.findOne({prefix: (args[1] || "").toLowerCase()})

        if(!sound){
            modules.twitchClient.say(target, "@" + context["display-name"] + `, Zvuk nebyl nalezen`)
            return
        }

        if(points < sound.price){
            modules.twitchClient.say(target, "@" + context["display-name"] + `, Na toto nemáš dostatek G$`)
            return
        }

        if(cooldowns[sound._id]){
            if((new Date() - cooldowns[sound._id]) < sound.cooldown){
                modules.twitchClient.say(target, "@" + context["display-name"] + `, Na tento zvuk aktuálně platí cooldown`)
                return
            }
        }
        cooldowns[sound._id] = new Date()

        if(sound.message)
            modules.twitchClient.say(target, "@" + context["display-name"] + `, ${sound.message}`)
        else
            modules.twitchClient.say(target, "@" + context["display-name"] + `, Tvůj zvuk bude přehrán`)

        sound.user = context["display-name"]
        modules.streamAudioQueue.insert(sound)

    }
}