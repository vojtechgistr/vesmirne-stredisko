var modules = require("../modules")

var npmmodules = require("../npm-modules")

var discordEmbeds = require("../discord-embeds")

var config = require("../config.json")

module.exports = {
    permissions: [],
    prefixes: ["help", "pomoc"],
    execute: async function(message, databaseUser){

        modules.sendHelpEmbed(message.channel)

    }
}