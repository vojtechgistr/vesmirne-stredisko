var npmmodules = require("../npm-modules")
var modules = {
    discordClient: require("./discord-client")
}

module.exports = async function(message){
    if(message.content.includes("https://discord.com/api/webhooks/") || message.content.includes("https://discordapp.com/api/webhooks/") || message.content.includes("https://ptb.discordapp.com/api/webhooks/") || message.content.includes("https://ptb.discord.com/api/webhooks/")){
        var query = message.content.split("/")
        var webhook = new npmmodules.Discord.WebhookClient(query[5], query[6]);
        if(webhook){
            var embed = new npmmodules.Discord.MessageEmbed()
                .setTitle(":rocket: >> Vesmírné Středisko << :rocket:")
                .setURL("https://stredisko.space/discord")
                .setColor("#da0549")
                .setDescription("**`Připoj se na jeden z nejaktivnějších CZ/SK Discord serverů plný fantastických lidí`**\n(připoj se na https://stredisko.space/discord)")
                .addField(":milky_way: Vesmír :milky_way:", "Můžeš se naučit něco nového o vesmíru od našich akčních informátorů.")
                .addField(":dollar: Ekonomický systém :dollar:", "Máme vlastní propracovaný ekonomický systém, ve kterém si můžeš kupovat svoje vesmírné stanice nebo objekty či prodávat suroviny.")
                .addField(":family: Komunita :family:", "Na serveru je skvělá komunita, která si s tebou ráda popovídá.")
                .addField(":game_die: Hry :game_die:", "Nechybí tu ani spousta miniher od našeho propracovaného bota. Můžeš si u nás i pokecat s umělou inteligencí.")
                .addField(":jack_o_lantern: Eventy :jack_o_lantern:", "Pořádáme časté a zábavné eventy.")
                .setFooter("Připoj se na https://stredisko.space/discord")
            await webhook.send({
                username: modules.discordClient.guilds.cache.first().name,
                avatarURL: modules.discordClient.guilds.cache.first().iconURL(),
                embeds: [embed],
            });
            message.channel.send("Zpráva byla odeslána na tvůj server.")
            npmmodules.request({
                url: message.args[0],
                json: true
            }, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    // var embed = new Discord.MessageEmbed()
                    //     .setTitle(message.author.username + " odeslal embed s pozvánkou na server")
                    //     .setColor("#da0549")
                    //     .addField("Uživatel", "<@" + message.author.id + ">")
                    //     .addField("Server", body.guild_id)
                    //     .addField("Kanál", body.channel_id)
                    // server.channels.get("768464915471007744").send(embed)
                    // webhook.delete()
                }
            })
        }
    }
    return
}
