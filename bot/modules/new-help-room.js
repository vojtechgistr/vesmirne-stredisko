var modules = {
    discordClient: require("./discord-client")
}

var npmmodules = require("../npm-modules")

var config = require("../config.json")

var discordEmbeds = require("../discord-embeds")

module.exports = async function(event){
    if(modules.discordClient.guilds.cache.first().channels.cache.find(channel => channel.parentID == config.discord.guild.helpCategory && channel.id != config.discord.guild.helpRoom && channel.topic == event.d.user_id)){
        modules.discordClient.guilds.cache.first().members.cache.get(event.d.user_id).send(discordEmbeds.warning("Již máš založený kanál pro pomoc")).catch(() => {})
        return
    }
    var newChannel = await modules.discordClient.guilds.cache.first().channels.create(event.d.member.user.username, {
        parent: modules.discordClient.channels.cache.get(config.discord.guild.helpCategory),
        topic: event.d.member.user.id,
        permissionOverwrites: [
            {
                id: modules.discordClient.guilds.cache.first().id,
                deny: ['VIEW_CHANNEL']
            },
            {
                id: event.d.member.user.id,
                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES'],
            },
        ]
    })
    var embed = new npmmodules.Discord.MessageEmbed()
        .setColor(config.colors[0])
        .setTitle("❓ Toto je tvůj nový kanál pro pomoc ❓")
        .setDescription("Nyní prosím **pošli co nejpřesnější popis tvého problému v jedné zprávě**, abychom věděli, jakému helperovi máme tvůj problém přiřadit. :smile:")
    newChannel.send(`<@${event.d.member.user.id}>`, {embed: embed})
    var collector = newChannel.createMessageCollector(message => message.author.id == event.d.member.user.id, {time:3600000, max: 1})
    collector.on("collect", async collected => {
        newChannel.send("Děkuji, nyní prosím počkej, až se připojí helper. :wink:")
        var embed = new npmmodules.Discord.MessageEmbed()
            .setColor(config.colors[0])
            .setTitle("❓ Nová žádost o pomoc ❓")
            .setDescription("Pro přijmutí zareaguj s ✅")
            .addField("🎢 Téma 🎢", "`" + collected.content + "`")
            .addField("👨 Člen 👨", `<@${event.d.member.user.id}>`)
        var requestMessage = await modules.discordClient.guilds.cache.first().channels.cache.get(config.discord.guild.helpRequestRoom).send(`<@&${config.discord.guild.helperRole}>`, {embed: embed})
        requestMessage.react("✅")
        var emojiCollector = requestMessage.createReactionCollector((reaction, user) => reaction.emoji.name == "✅" && user.id != modules.discordClient.user.id, { time: 3600000, max: 1 });
        emojiCollector.on("collect", async (collectedReaction, user) => {
            embed.setDescription("Žádost byla již přijata helperem <@" + user.id + ">")
            requestMessage.edit(`<@&${config.discord.guild.helperRole}>`, {embed: embed})
            await newChannel.updateOverwrite(user, {VIEW_CHANNEL: true})
            var newHelperEmbed = new npmmodules.Discord.MessageEmbed()
                .setColor(config.colors[0])
                .setTitle("❓ Připojil se helper ❓")
                .setDescription("Připojil se helper <@" + user.id + ">")
            newChannel.send(`<@${event.d.member.user.id}> <@${user.id}>`, {embed: newHelperEmbed})
        })
        emojiCollector.on("end", collected => {
            if(collected.size <= 0){
                newChannel.delete()
                embed.setDescription("Žádost nikdo nepřijal. Místnost byla uzavřena.")
                requestMessage.edit(`<@&${config.discord.guild.helperRole}>`, {embed: embed})
            }
        })
    })
    collector.on("end", collected => {
        if(collected.size <= 0)
            newChannel.delete()
    })
}