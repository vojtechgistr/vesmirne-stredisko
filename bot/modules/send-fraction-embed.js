var npmmodules = require("../npm-modules")

var modules = {
    discordClient: require("./discord-client")
}

var discordEmbeds = require("../discord-embeds")
require("../ExtendedMessage");

module.exports = async function(message, UserID, type){
    var message = await message.inlineReply(discordEmbeds.fraction(type)).catch(() => {})
    if(!message)
        return
    message.react("1️⃣")
    message.react("2️⃣")
    message.react("3️⃣")
    const collector = message.createReactionCollector((reaction, user) => user.id != modules.discordClient.user.id, { time: 3600000 });
    collector.on('collect', (reaction, user) => {
        switch(reaction.emoji.name){
            case "1️⃣":
                message.edit(discordEmbeds.fraction(0))
                reaction.users.remove(user.id);
                break
            case "2️⃣":
                message.edit(discordEmbeds.fraction(1))
                reaction.users.remove(user.id);
                break
            case "3️⃣":
                message.edit(discordEmbeds.fraction(2))
                reaction.users.remove(user.id);
                break
        }
    });
}