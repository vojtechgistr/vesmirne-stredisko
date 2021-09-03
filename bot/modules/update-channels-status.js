var modules = {
    discordClient: require("./discord-client")
}

var config = require("../config.json")

module.exports = async function(){
    const guild = modules.discordClient.guilds.cache.get("531497565749772294"); 
    const guildMembers = await guild.memberCount

    guild.channels.cache.get("771309946150453249").setName(`👪 Počet členů: ${guildMembers}`);
}