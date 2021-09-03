var npmmodules = require("../npm-modules")

var config = require("../config.json")

module.exports = function(id){
    switch(id){
        case 0:
            return new npmmodules.Discord.MessageEmbed()
                .setColor('0xffffff')
                .setTitle("Co jsou to frakce Vesmírného Střediska?")
                .setDescription(`Ve vesmíru působí mnoho nadnárodních korporací, a některé z nich přesunuly své sídlo na oběžnou dráhu Země, aby mohly vesmír "dobývat" rychleji. Obyvatelé střediska mohou tyto korporace podporovat a stát se součástí frakcí, které jim přináší rozmanité výhody.\n\nFrakcí je momentálně 5, každá má jiné zaměření a z toho plynoucí výhody. V budoucnu se budou frakce zapojovat i do příběhu a eventů, a to každá trochu jiným způsobem. Časem přijdete na to, že nějaké frakce se vyplatí pouze v kombinaci s určitými zakoupenými stanicemi nebo minihrami, které hrajete.\n\nKaždá frakce má vlastní pasivní výhodu, která vám zlevní nějaké položky, nebo naopak zvýší jejich zisk. Tuto výhodu lze zvyšovat v průběhu budoucích eventů, nebo pokud budete ve frakci stálými členy. Pro získání aktivní výhody je zpravidla nutné splnit nějaký úkol. Některé frakce mají požadavky, které musíte splňovat než se k nim připojíte. \n\n__Důležité upozornění:__ Opustíte-li frakci, dalších 14 dní se do žádné další nemůžete připojit, proto vše důkladně zvažujte.`)
                .setThumbnail("https://i.imgur.com/idHIkpo.png")
                .setAuthor('Frakce (strana 1/3)', `https://i.imgur.com/idHIkpo.png`)

        case 1:
            return new npmmodules.Discord.MessageEmbed()
            .setColor('0xffffff')
            .setTitle("Krátké popisy jednotlivých frakcí")
            .setThumbnail('https://i.imgur.com/idHIkpo.png')
            .setAuthor('Frakce (strana 2/3)', 'https://i.imgur.com/idHIkpo.png')
            .addField(`⛏ Těžební Frakce - Terraq`, `- zvýšení efektivity těžby železa, síry a vodíku\n- __výhoda:__ za určitý počet zpráv za den si můžeš vyzvednout \n  odměnu ve formě těžebních surovin`)
            .addField(`💸 Ekonomická Frakce - Cryptos`, `- zvýšení zisku bitcoinů za vyřešený příklad\n- __výhoda:__ za určitý počet zpráv za den si můžeš vyzvednout \n  odměnu ve formě bitcoinů`)
            .addField(`👥 Kolonizační Frakce - UMCG`, `- větší zisk z každé zprávy, co napíšeš\n- __výhoda:__ za určitý počet zpráv za den si můžeš vyzvednout \n  odměnu ve formě G$`)
            .addField(`⚔️ Frakce Strážců - The Wardens`, `- slevy na většinu položek\n- __výhoda:__ účastni se ve více lidech řešení úkolů na středisku a \n  získáš výplatu v podobě G$`)
            .addField(`🔬 Výzkumná Frakce - Futura`, `- oprávnění podnikat na Saturnu a výzkumné stanice jsou levnější\n- __výhoda:__ za určitý počet zpráv za den si můžeš vyzvednout \n  odměnu ve formě jednotek výzkumu`)
        case 2:
            return new npmmodules.Discord.MessageEmbed()
                .setColor('0xffffff')
                .setTitle("Příkazy frakcí")
                .setDescription("Zde je přehled příkazů, které pro práci s frakcemi potřebujete.\n\n`.frakce` - zobrazí tento návod a vysvětlení frakcí\n`.frakce seznam` - zobrazí krátké popisy všech frakcí\n`.frakce příkazy` - zobrazí tento návod\n\n`.frakce terraq` - zobrazí detailní popis těžební frakce Terraq\n`.frakce cryptos` - zobrazí detailní popis ekonomické frakce Cryptos\n`.frakce umcg` - zobrazí detilní popis kolonizační frakce UMCG\n`.frakce wardens` - zobrazí detailní popis frakce strážců The Wardens\n`.frakce futura` - zobrazí detailní popis vědecké frakce Futura\n\n`.frakce připojit terraq` - připojení do frakce Terraq\n`.frakce připojit cryptos` - připojení do frakce Cryptos\n`.frakce připojit umcg` - připojení do frakce UMCG\n`.frakce připojit the wardens` - připojení do frakce The Wardens\n`.frakce připojit futura` - připojení do frakce Futura\n\n`.frakce opustit` - opuštění aktuální frakce\n")
                .setThumbnail('https://i.imgur.com/idHIkpo.png')
                .setAuthor('Frakce (strana 3/3)', 'https://i.imgur.com/idHIkpo.png')
    }
}