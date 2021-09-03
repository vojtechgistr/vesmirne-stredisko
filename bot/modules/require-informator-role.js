var modules = {
    discordClient: require("./discord-client")
}

var config = require("../config.json")

module.exports = function(req, res, next){
    var discordMember = modules.discordClient.guilds.cache.first().members.cache.get(req.user.discord_id);
    if(!discordMember){
        res.redirect(config.discord.application.loginPage)
        return
    }
    if(discordMember._roles.includes(config.discord.guild.informatorRole)){
        next()
        return
    }else{
        res.redirect("/")
        return
    }
}