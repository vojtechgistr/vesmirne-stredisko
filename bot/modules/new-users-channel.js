var modules = {
    discordClient: require("./discord-client"),
    haveItem: require("./have-item"),
    getIDFromDiscordID: require("./get-id-from-discord-id"),
    mongodb: require("./mongodb")
}

var npmmodules = require("../npm-modules")

var config = require("../config.json")

var discordEmbeds = require("../discord-embeds")

module.exports = async function(event){
    var points = await modules.haveItem(await modules.getIDFromDiscordID(event.d.user_id), 0)
    if(points < 100){
        modules.discordClient.guilds.cache.first().members.cache.get(event.d.user_id).send(discordEmbeds.notEnougthFunds(100, points)).catch(() => {})
        return
    }
    modules.mongodb.collections.items.insertOne({user_id: await modules.getIDFromDiscordID(event.d.user_id), count: -100, item_id: 0})
    var type = ""
    if(event.d.emoji.name == "🎤"){
        type = "voice"
    }
    if(event.d.emoji.name == "💬"){
        type = "text"
    }
    var channel = await modules.discordClient.guilds.cache.first().channels.create("nový-" + type, {
        type: type,
        parent: modules.discordClient.guilds.cache.first().channels.cache.get(config.discord.guild.usersChannelsCategory),
        topic: "Kanál založený členem <@" + event.d.user_id + ">",
        permissionOverwrites: [
            {
                id: event.d.user_id,
                allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS'],
            },
            {
                id: modules.discordClient.guilds.cache.first().id,
                deny: ['VIEW_CHANNEL'],
            }
        ]
    })
    if(type == "text"){
        var embed = new npmmodules.Discord.MessageEmbed()
            .setColor(config.colors[0])
            .setTitle(":sparkles: Tvůj nový textový kanál :sparkles:")
            .setDescription("Zde je tvůj nový textový kanál.\nToto místo vidíš pouze ty a lidé, kteří se za tebou připojí.\nToto místo zároveň nebude kontrolováno podle klasických pravidel, ale pouze pokud zde bude probíhat kyberšikana nebo šíření zakázaného obsahu (v takovém případě označ <@&" + config.discord.guild.můstekRole + ">)")
            .addField(":new: Přidání nového člena do kanálu :new:", "Pro přidání nového člena do kanálu mu pošli tento příkaz `" + config.discord.bot.prefix + "připojit " + channel.id + "`.\n Pokud tento příkaz pošle do jakéhokoliv kanálu, automaticky se sem připojí")
            .addField(":pen_ballpoint: Úpravy kanálu :pen_ballpoint:", "Pokud máš nastavené dvoufázové ověření můžeš kanál libovolně přejmenovat nebo smazat")
            .addField(":dollar: Odměny za aktivitu :dollar:", "V tomto kanále nebudete dostávat žádné body za aktivitu")
            .addField(":bust_in_silhouette: Automatické mazání :bust_in_silhouette:", "Pokud do kanálu nepříjde po týdnu žádná zpráva, kanál bude automaticky smazán")
            .addField(":one: Příkaz `" + config.discord.bot.prefix + "pingall` :one:", "Tento příkaz označí všechny členy tohoto kanálu")
        channel.send(`<@${event.d.user_id}>`, {embed:embed})
        channel.send(config.discord.bot.prefix + "připojit " + channel.id)
    }
    if(type == "voice"){
        var embed = new npmmodules.Discord.MessageEmbed()
            .setColor(config.colors[0])
            .setTitle(":sparkles: Tvůj nový hlasový kanál :sparkles:")
            .setDescription("Byl pro tebe založen nový hlasový kanál.\nToto místo vidíš pouze ty a lidé, kteří se za tebou připojí.\nToto místo zároveň nebude kontrolováno podle klasických pravidel, ale pouze pokud zde bude probíhat kyberšikana nebo šíření zakázaného obsahu (v takovém případě označ můstek)")
            .addField(":new: Přidání nového člena do kanálu :new:", "Pro přidání nového člena do kanálu mu pošli tento příkaz `" + config.discord.bot.prefix + "připojit " + channel.id + "`.\n Pokud tento příkaz pošle do jakéhokoliv kanálu, automaticky se tam připojí")
            .addField(":pen_ballpoint: Úpravy kanálu :pen_ballpoint:", "Pokud máš nastavené dvoufázové ověření můžeš kanál libovolně přejmenovat nebo smazat")
        modules.discordClient.guilds.cache.first().members.cache.get(event.d.user_id).send(embed).catch(() => {})
        modules.discordClient.guilds.cache.first().members.cache.get(event.d.user_id).send(config.discord.bot.prefix + "připojit " + channel.id).catch(() => {})
    }
}