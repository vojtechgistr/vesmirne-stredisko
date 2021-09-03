var npmmodules = require("../npm-modules")

var modules = {
    discordClient: require("./discord-client")
}

var discordEmbeds = require("../discord-embeds")

module.exports = async function(channel){
    var message = await channel.send(discordEmbeds.help(0)).catch(() => {})
    if(!message)
        return
    message.react("0️⃣")
    message.react("👨‍⚕️")
    message.react("📉")
    const collector = message.createReactionCollector((reaction, user) => user.id != modules.discordClient.user.id, { time: 3600000 });
    collector.on('collect', (reaction, user) => {
        switch(reaction.emoji.name){
            case "0️⃣":
                message.edit(discordEmbeds.help(0))
                reaction.users.remove(user.id);
                break
            case "👨‍⚕️":
                message.edit(discordEmbeds.help(1))
                reaction.users.remove(user.id);
                break
            case "📉":
                message.edit(discordEmbeds.help(2))
                reaction.users.remove(user.id);
                break
        }
    });
}