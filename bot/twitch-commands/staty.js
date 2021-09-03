var modules = require("../modules")

var npmmodules = require("../npm-modules")

var config = require("../config.json")

module.exports = {
    requiresLogin: true,
    prefixes: ["staty"],
    execute: async function(target, context, msg, self, databaseUser){

        var points = modules.haveItem(databaseUser._id, 0)

        modules.twitchClient.say(target, "@" + context["display-name"] + `, Máš ${points} G$`)

    }
}