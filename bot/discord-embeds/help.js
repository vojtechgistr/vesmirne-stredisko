var npmmodules = require("../npm-modules")

var config = require("../config.json")

module.exports = function(id){
    switch(id){
        case 0:
            return new npmmodules.Discord.MessageEmbed()
                .setColor(config.colors[0])
                .setTitle("❓ Pomoc ❓")
                .setDescription("Vyber si kategorii, se kterou potřebuješ pomoct")
                .addField("0️⃣ Hlavní menu (aktualní menu) 0️⃣", "Zareaguj s 0️⃣")
                .addField("👨‍⚕️ Role 👨‍⚕️", "Zareaguj s 👨‍⚕️")
                .addField("📉 Ekonomika jednoduše 📉", "Zareaguj s 📉")
        case 1:
            return new npmmodules.Discord.MessageEmbed()
                .setColor(config.colors[0])
                .setTitle("👨‍⚕️ Role 👨‍⚕️")
                .setDescription("**Pro získání vyšších rank rolí (země, mars, venuše, ...) si zakup oprávnění (více v <#768465136822124564>)**\n\n**🔰│Můstek** - Spolumajitelé\n**🛡️│Vesmírný Administrátor** - Administrátoři\n**⚔️│Vesmírný Strážník** - Moderátoři\n**📖│Vesmírný Průvodce** - Helpeři\n**📆│Vesmírný Organizátor** - Eventeři\n**🔥│Vesmírná Tryska** - Server boosteři\n**📰 │Vesmírný Zpravodaj** - Informátor v <#757243049452503040>\n**👨‍🚀│Astronaut** - Automatická role\n**👤│Temná Hmota** - Muted role")
        case 2:
            return new npmmodules.Discord.MessageEmbed()
                .setColor(config.colors[0])
                .setTitle("📉 Ekonomika jednoduše 📉")
                .setDescription("Hele, je to jednoduchý :smile:\n\n1) **Za aktivitu** na tomto serveru a projekty s ním spojenými **získáváš naší měnu G$ 💵** \n(psaní do chatu 💬, aktivitu ve voice kanálech 🎤)\n\n2) **Je tu** takový základní **koloběh** ♻️ \n`Peníze 💵 => oprávnění na stanice 🎫 => objekty 🏭 => suroviny 🧪 => peníze 💵 / výhody`\n\n**Oprávnění na stanice** si můžeš prohlédnou a zakoupit pomocí `" + config.discord.bot.prefix + "stanice`\nPomocí `" + config.discord.bot.prefix + "položka [id položky (u stanic 100 - 199)]` se **můžeš podívat, jaké objekty ti dané oprávnění odemkne**.")
                .addField("📜 Příkazy 📜", `Všechny příkazy jsou dostupné i bez diakritiky\n\`${config.discord.bot.prefix}stanice\` - zobrazí všechny stanice 🎫\n\`${config.discord.bot.prefix}položky\` - zobrazí všechny položky 💡\n\`${config.discord.bot.prefix}inventář\` - zobrazí tvoje položky 🧰\n\`${config.discord.bot.prefix}položka [id položky]\` - zobrazí informace o dané položce ℹ️\n\`${config.discord.bot.prefix}koupit [id položky] [(množství)]\` - zakoupí položku 💸\n\`${config.discord.bot.prefix}prodat [id položky] [(množství)]\` - prodá položku 💰\n\`${config.discord.bot.prefix}frakce\` - zobrazí informace o frakcích <:VSsaturn:676563792792125451>`)
    }
}