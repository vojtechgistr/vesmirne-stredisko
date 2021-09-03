var modules = require("../modules")

var { MessageEmbed } = require('discord.js')
var npmmodules = require("../npm-modules")

var discordEmbeds = require("../discord-embeds")

var config = require("../config.json")
require("../ExtendedMessage");

module.exports = {
    roles: [],
    prefixes: ["frakce"],
    execute: async function(message, databaseUser){

        const fraction = await modules.mongodb.collections.frakce.find({user_id: message.author.id}).toArray()
        var type
        var messageCount
        var claimedDaily
        var leaveDate

        if(fraction.length < 1) {
            await modules.mongodb.collections.frakce.insertOne({user_id: message.author.id, type: "free", messageCount: null, lastMessage: new Date(), claimedDaily: false, leaveDate: "never"})
        }

        fraction.forEach(data => {
            messageCount = data.messages
            type = data.type
            claimedDaily = data.claimedDaily
            leaveDate = data.leaveDate
        })

        if(!message.args[1]) {
            modules.sendFractionEmbed(message, message.author.id, 0)

        } else if(message.args[1].toLowerCase() == "seznam") {
            modules.sendFractionEmbed(message, message.author.id, 1)


        } else if(message.args[1].toLowerCase() == "příkazy" || message.args[1] == "príkazy" || message.args[1] == "prikazy" || message.args[1] == "přikazy") {
            modules.sendFractionEmbed(message, message.author.id, 2)


        } else if (message.args[1].toLowerCase() == "terraq" || message.args[1] == "teraq") {
            const terraqEmbed = new MessageEmbed()
            .setTitle('Terraq')
            .setDescription('Těžební gigant Terraq se po úspěšném ovládnutí Zemské těžby železa vydává hledat drahé kovy a další materiály i do vesmíru. Jeho technologie umožňuje získat přímo surový produkt z nalezené rudy za rekordní čas, což z něj dělá silného dobyvatele pevných planet sluneční soustavy.\nㅤ')
            .setThumbnail('https://i.imgur.com/7gNHbrg.png')
            .setAuthor('Těžební frakce', 'https://i.imgur.com/7gNHbrg.png')
            .setColor('0x964B00')
            .setFooter('Naše vůle hledat v hlubinách je jak ze železa...')
            .addField('Požadavky', 'Vlastnit Oprávnění Venuše.', false)
            .addField('\u200B', '\u200B')
            .addField('Pasivní výhoda', '__1)__\tEfektivita těžby železa a síry vyšší o 10%\n__2)__\tEfektivita těžby železa a síry vyšší o 15%\n__3)__\tEfektivita těžby železa síry a vodíku vyšší o 25%', true)
            .addField('Přestup na vyšší úroveň', 'Vyšší pasivní výhodu získáte v rámci eventů, nebo pokud budete dostatečně dlouho členy této frakce.', true)
            .addField('Aktivní výhoda', 'Při splnění počtu 150 zpráv za den budete mít možnost vyzvednout balíček, který může obsahovat náhodné počty železa (20-60) a síry (10-40).', true)
            .addField('\u200B', '\u200B')
            .addField('Připojení', 'Pro připojení do frakce napište příkaz `.frakce připojit terraq` , ale nezapomeňte, že pokud frakci opustíte, budete muset počkat 14 dní než se můžete připojit do nové!', false)
            return message.inlineReply(terraqEmbed)


        } else if (message.args[1].toLowerCase() == "cryptos") {
            const cryptosEmbed = new MessageEmbed()
            .setTitle('Cryptos')
            .setDescription('Trh s kryptoměnami značně stoupl po vzniku střediska na popularitě. S bitcoiny a jinými kryptoměnami se ve vesmírných programech pracuje již běžně, a právě nedávno se podařilo společnosti Cryptos získat vedoucí pozici v určování kurzů a regulování vesmírné ekonomiky. Jejich specializované těžírny kryptoměn jsou na středisku velkým zdrojem příjmů.\nㅤ')
            .setThumbnail('https://imgur.com/wpJ5bwo.png')
            .setAuthor('Ekonomická frakce', 'https://imgur.com/wpJ5bwo.png')
            .setColor('0xFFD700')
            .setFooter('My jsme ekonomika hvězd!')
            .addField('Požadavky', 'Alespoň jeden bitcoin v inventáři.', false)
            .addField('\u200B', '\u200B')
            .addField('Pasivní výhoda', '__1)__\tZisk bitcoinů o 10% vyšší\n__2)__\tZisk bitcoinů o 15% vyšší\n__3)__\tZisk bitcoinů o 25% vyšší + 1000G$ okamžitě', true)
            .addField('Přestup na vyšší úroveň', 'Vyšší pasivní výhodu získáte v rámci eventů, nebo pokud budete dostatečně dlouho členy této frakce.', true)
            .addField('Aktivní výhoda', 'Při splnění počtu 150 zpráv za den budete mít možnost vyzvednout balíček, který může obsahovat náhodný počet bitcoinů (25-50).', true)
            .addField('\u200B', '\u200B')
            .addField('Připojení', 'Pro připojení do frakce napište příkaz `.frakce připojit cryptos` , ale nezapomeňte, že pokud frakci opustíte, budete muset počkat 14 dní než se můžete připojit do nové!', false)
            return message.inlineReply(cryptosEmbed)


        } else if (message.args[1].toLowerCase() == "umcg") {
            const cryptosEmbed = new MessageEmbed()
            .setTitle('UMCG (United Mars Colonization Group)')
            .setDescription('Původně jako odnož NASA se UMCG pokusila jako první založit funkční lidskou základnu na povrchu Marsu. Mise byla úspěšná, a celý projekt následně odkoupilo několik miliardářů s cílem založit prosperující město v jednom z kráterů Marsu. Vznik střediska byl pro kolonizaci velmi pozitivní pokrok, UMCG tedy nyní své projekty připravuje právě zde.\nㅤ')
            .setThumbnail('https://i.imgur.com/gy2wAL4.png')
            .setAuthor('Kolonizační frakce', 'https://i.imgur.com/gy2wAL4.png')
            .setColor('0xFFFFFF')
            .setFooter('Společně postavíme nový svět...')
            .addField('Požadavky', 'Žádné.', false)
            .addField('\u200B', '\u200B')
            .addField('Pasivní výhoda', '__1)__\tZisk z každé zprávy o 10% vyšší\n__2)__\tZisk z každé zprávy o 15% vyšší\n__3)__\tZisk z každé zprávy o 20% vyšší + jedna kolonie navíc (i bez oprávnění na Mars)', true)
            .addField('Přestup na vyšší úroveň', 'Vyšší pasivní výhodu získáte v rámci eventů, nebo pokud budete dostatečně dlouho členy této frakce.', true)
            .addField('Aktivní výhoda', 'Při splnění počtu 150 zpráv za den budete mít možnost vyzvednout balíček, který může obsahovat náhodné počty G$ (50-100).', true)
            .addField('\u200B', '\u200B')
            .addField('Připojení', 'Pro připojení do frakce napište příkaz `.frakce připojit umcg` , ale nezapomeňte, že pokud frakci opustíte, budete muset počkat 14 dní než se můžete připojit do nové!', false)
            return message.inlineReply(cryptosEmbed)


        } else if (message.args[1].toLowerCase() == "wardens" || (message.args[1].toLowerCase() == "the" && message.args[2].toLowerCase() == "wardens")) {
            const cryptosEmbed = new MessageEmbed()
            .setTitle('The Wardens')
            .setDescription('Středisko je otevřené široké komunitě různých lidí, a bohužel mu hrozí nebezpečí zvenčí, ale i zevnitř. Aby byl každý člen střediska v bezpečí, a stabilita vesmírného kolosu nebyla ohrožena, vedení střediska založilo organizaci The Wardens. Dobře vycvičení strážci ve všech odvětvích nedají dopustit, aby se na středisku někomu něco stalo. Však jsou za to taky slušně placení.\nㅤ')
            .setThumbnail('https://i.imgur.com/dGhIiCN.png')
            .setAuthor('Frakce strážců střediska', 'https://i.imgur.com/dGhIiCN.png')
            .setColor('0x81dbff')
            .setFooter('Staráme se o váš mír a bezpečí...')
            .addField('Požadavky', 'Žádné.', false)
            .addField('\u200B', '\u200B')
            .addField('Pasivní výhoda', '__1)__\tVšechna oprávnění o 5% levnější\n__2)__\tVšechna oprávnění o 10% levnější\n__3)__\tVšechna oprávnění o 15% levnější + všechny objekty o 5% levnější', true)
            .addField('Přestup na vyšší úroveň', 'Vyšší pasivní výhodu získáte v rámci eventů, nebo pokud budete dostatečně dlouho členy této frakce.', true)
            .addField('Aktivní výhoda', 'Každý den v 00:00 se v místnosti strážců zobrazí čas, kdy nastane na středisku problém a počet potřebných řešitelů. V tento čas se zobrazí zpráva s problémem, který bude třeba vyřešit. Je potřeba 2-6 strážců, aby ho během čtvrt hodiny reakcí vyřešili. Všichni zúčastnění pak dostanou výplatu: 60-180G$ (30 za každého řešitele).', false)
            .addField('\u200B', '\u200B')
            .addField('Připojení', 'Pro připojení do frakce napište příkaz `.frakce připojit the wardens` , ale nezapomeňte, že pokud frakci opustíte, budete muset počkat 14 dní než se můžete připojit do nové!', false)
            return message.inlineReply(cryptosEmbed)


        } else if (message.args[1].toLowerCase() == "futura") {
            const cryptosEmbed = new MessageEmbed()
            .setTitle('Futura')
            .setDescription('Futura vznikla spojením mnoho vědců z celého světa, které spojuje mnoho vědeckých i filozofických otázek. Jejich cílem je posouvat hranice lidského vědění, a objevovat dosud neobjevené. Výzkumy futury financují výzkumné fondy střediska, ale často i ostatní společnosti, které se o její vynálezy přímo perou.\nㅤ')
            .setThumbnail('https://i.imgur.com/8OV0OEJ.png')
            .setAuthor('Vědecká frakce', 'https://i.imgur.com/8OV0OEJ.png')
            .setColor('0x74f740')
            .setFooter('Posouváme hranice moderního světa...')
            .addField('Požadavky', 'Žádné.', false)
            .addField('\u200B', '\u200B')
            .addField('Pasivní výhoda', '__1)__\tOprávnění na Saturn a výzkumné stanice o 10% levnější\n__2)__\tOprávnění na Saturn a výzkumné stanice o 15% levnější\n__3)__\tOprávnění na Saturn a výzkumné stanice o 25% levnější + oprávnění na NVO zónu o 10% levnější', true)
            .addField('Přestup na vyšší úroveň', 'Vyšší pasivní výhodu získáte v rámci eventů, nebo pokud budete dostatečně dlouho členy této frakce.', true)
            .addField('Aktivní výhoda', 'Při splnění počtu 150 zpráv za den budete mít možnost vyzvednout si odměnu jeden výzkum.', false)
            .addField('\u200B', '\u200B')
            .addField('Připojení', 'Pro připojení do frakce napište příkaz `.frakce připojit futura` , ale nezapomeňte, že pokud frakci opustíte, budete muset počkat 14 dní než se můžete připojit do nové!', false)
            return message.inlineReply(cryptosEmbed)


        } else if (message.args[1].toLowerCase() == "opustit") {

            let left = new MessageEmbed()
            .setTitle(`Opustil/a jsi frakci ${type}!`)
            .setDescription(`Nyní nejsi členem žádné frakce (neplatí pro tebe žádné frakční výhody), a do jiné z frakcí se nemůžeš připojit dalších 14 dní.`)
            .setColor('0xfd0000')
            .setThumbnail('https://i.pinimg.com/originals/d0/17/47/d01747c4285afa4e7a6e8656c9cd60cb.png')


            if(type == "free") { return message.inlineReply(discordEmbeds.warning("Nejsi v žádné frakci", `Připojit do frakce se můžeš pomocí \`.frakce připojit\``)) }
            else {
                
                if(type == "Terraq") {
                    let role = message.guild.roles.cache.get(config.discord.fractions.terraq);
                    message.member.roles.remove(role);
                } else if(type == "Cryptos") {
                    let role = message.guild.roles.cache.get(config.discord.fractions.cryptos);
                    message.member.roles.remove(role);
                } else if(type == "UMCG") {
                    let role = message.guild.roles.cache.get(config.discord.fractions.umcg);
                    message.member.roles.remove(role);
                } else if(type == "The Wardens") {
                    let role = message.guild.roles.cache.get(config.discord.fractions.wardens);
                    message.member.roles.remove(role);
                } else if(type == "Futura") {
                    let role = message.guild.roles.cache.get(config.discord.fractions.futura);
                    message.member.roles.remove(role);
                }

                await modules.mongodb.collections.frakce.findOneAndUpdate({user_id: message.author.id}, {$set: {type: "free", leaveDate: new Date()}})
                return message.inlineReply(left)
            }
        }

    // ------------------------------------------------------------------------------------------------------------------------------------------------------- //
    // -------------------------------------------------------------------- JOIN FRACTION -------------------------------------------------------------------- //
    // ------------------------------------------------------------------------------------------------------------------------------------------------------- //

    
        else if(message.args[1].toLowerCase() == 'připojit' || message.args[1].toLowerCase() == 'pripojit') {
            const requirements = new MessageEmbed()
            .setTitle('Nesplňuješ požadavky pro vstup do zvolené frakce!')
            .setDescription(`${message.author} pozorně si přečti, co musíš splňovat, abys mohl být členem zvolené frakce.`)
            .setColor('0xfd0000')
            .setThumbnail('https://i.pinimg.com/originals/d0/17/47/d01747c4285afa4e7a6e8656c9cd60cb.png')
    
            const t_join = new MessageEmbed()
            .setTitle('Připojil/a ses k frakci Terraq!')
            .setDescription(`Vítej mezi námi, takových jako ty nikdy není dost. Síla a odvaha vpřed, a těžbě zdar!`)
            .setColor('0x953700')
            .setThumbnail('https://imgur.com/7gNHbrg.png')
    
            const c_join = new MessageEmbed()
            .setTitle('Připojil/a ses k frakci Cryptos!')
            .setDescription('Je dobře, že jsi mezi námi, teď teprve poznáš jak se dělá byznys! Díky tobě půjdou kurzy ke hvězdám, v náš prospěch samozřejmě...')
            .setColor('0xddbe11')
            .setThumbnail('https://imgur.com/wpJ5bwo.png')
    
            const u_join = new MessageEmbed()
            .setTitle('Připojil/a ses k frakci UMCG!')
            .setDescription('Další člověk ochotný pomoct nám v našem poslání? Čím víc nás bude, tím rychleji budou lidé žít na Marsu stejně tak dobře jako na Zemi!')
            .setColor('0xffffff')
            .setThumbnail('https://imgur.com/gy2wAL4.png')
    
            const w_join = new MessageEmbed()
            .setTitle('Připojil/a ses k frakci The Wardens!')
            .setDescription('Vesmírné Středisko ti děkuje! S tvou pomocí bude vesmír bezpečnjěším místem...')
            .setColor('0x81dbff')
            .setThumbnail('https://imgur.com/dGhIiCN.png')
    
            const f_join = new MessageEmbed()
            .setTitle('Připojil/a ses k frakci Futura!')
            .setDescription('Vítej v rodišti budousnosti, koukáme, že máš smysl pro vědění a pokrok. To se u nás nade vše cení!')
            .setColor('0x74f740')
            .setThumbnail('https://imgur.com/8OV0OEJ.png')


    
            let timeout = 1209600000
            
            if(leaveDate != null && timeout - (Date.now() - leaveDate) > 0) {
                let time = await modules.ms(timeout - (Date.now() - leaveDate));

                return message.inlineReply(discordEmbeds.warning(`Pozor, jsi limitován/a`, `Před nedávnem jsi nejspíše opustil/a nějakou frakci. (Zbývá **${time.days} dnů, ${time.hours} hodin a ${time.minutes} minut**)`))
            }

            if(message.args[2].toLowerCase() == 'terraq') {
                if(type == "free") {

                    var have = await modules.haveItem(databaseUser._id, 103)
                    
                    if(have > 0) {
                        let role = message.guild.roles.cache.get(config.discord.fractions.terraq);
                        message.member.roles.add(role);

                        await modules.mongodb.collections.frakce.findOneAndUpdate({user_id: message.author.id}, {$set: {type: "Terraq"}})
                        message.inlineReply(t_join)
                        return message.author.send(t_join).catch(()=>{})
                    
                    } else return message.inlineReply(requirements)
                    
                    
                } else {
                    if(message.args[2].toLowerCase() === type.toLowerCase()) {
                        message.inlineReply(discordEmbeds.warning(`Pozor`, `Již jsi ve frakci **${type}**! Nemůžeš se připojit do frakce, ve které jsi.`))
                    } else {
                        message.inlineReply(discordEmbeds.warning(`Pozor`, `Již jsi ve frakci **${type}**! Nemůžeš být ve více jak jedné frakci.`))
                    }
                }
               


            } else if(message.args[2].toLowerCase() == 'cryptos') {
                
                if(type == "free") {
                    var have = await modules.haveItem(databaseUser._id, 5)

                    if(have > 0) {
                        let role = message.guild.roles.cache.get(config.discord.fractions.cryptos);
                        message.member.roles.add(role);

                        await modules.mongodb.collections.frakce.findOneAndUpdate({user_id: message.author.id}, {$set: {type: "Cryptos"}})
                        message.author.send(c_join).catch(()=>{})
                        return message.inlineReply(c_join)
                    } else return message.inlineReply(requirements)
                    
                    
                } else {
                    if(message.args[2].toLowerCase() === type.toLowerCase()) {
                        return message.inlineReply(discordEmbeds.warning(`Pozor`, `Již jsi ve frakci **${type}**! Nemůžeš se připojit do frakce, ve které jsi.`))
                    } else {
                        return message.inlineReply(discordEmbeds.warning(`Pozor`, `Již jsi ve frakci **${type}**! Nemůžeš být ve více jak jedné frakci.`))
                    }
                }
               

            } else if(message.args[2].toLowerCase() == 'umcg') {
                if(type == "free") {
                    let role = message.guild.roles.cache.get(config.discord.fractions.umcg);
                    message.member.roles.add(role);

                    await modules.mongodb.collections.frakce.findOneAndUpdate({user_id: message.author.id}, {$set: {type: "UMCG"}})
                    message.author.send(u_join).catch(()=>{})
                    return message.inlineReply(u_join)
                    
                } else {
                    if(message.args[2].toLowerCase() === type.toLowerCase()) {
                        return message.inlineReply(discordEmbeds.warning(`Pozor`, `Již jsi ve frakci **${type}**! Nemůžeš se připojit do frakce, ve které jsi.`))
                    } else {
                        return message.inlineReply(discordEmbeds.warning(`Pozor`, `Již jsi ve frakci **${type}**! Nemůžeš být ve více jak jedné frakci.`))
                    }
                }
               
            } else if((message.args[2].toLowerCase() == "the" && message.args[3].toLowerCase() == "wardens")) {
                if(type == "free") {
                    let role = message.guild.roles.cache.get(config.discord.fractions.wardens);
                    message.member.roles.add(role);

                    await modules.mongodb.collections.frakce.findOneAndUpdate({user_id: message.author.id}, {$set: {type: "The Wardens"}})
                    return message.inlineReply(w_join)
                    
                } else {
                    if(message.args[2].toLowerCase() === type.toLowerCase() || message.args[3].toLowerCase() === type.toLowerCase()) {
                        
                        return message.inlineReply(discordEmbeds.warning(`Pozor`, `Již jsi ve frakci **${type}**! Nemůžeš se připojit do frakce, ve které jsi.`))
                    } else {
                        return message.inlineReply(discordEmbeds.warning(`Pozor`, `Již jsi ve frakci **${type}**! Nemůžeš být ve více jak jedné frakci.`))
                    }
                }
               

            } else if(message.args[2].toLowerCase() == 'futura') {
                if(type == "free") {
                    let role = message.guild.roles.cache.get(config.discord.fractions.futura);
                    message.member.roles.add(role);

                    await modules.mongodb.collections.frakce.findOneAndUpdate({user_id: message.author.id}, {$set: {type: "Futura"}})
                    message.author.send(f_join).catch(()=>{})
                    return message.inlineReply(f_join)
                    
                } else {
                    if(message.args[2].toLowerCase() === type.toLowerCase()) {
                        return message.inlineReply(discordEmbeds.warning(`Pozor`, `Již jsi ve frakci **${type}**! Nemůžeš se připojit do frakce, ve které jsi.`))
                    } else {
                        return message.inlineReply(discordEmbeds.warning(`Pozor`, `Již jsi ve frakci **${type}**! Nemůžeš být ve více jak jedné frakci.`))
                    }
                }
               
            } else {
                modules.sendFractionEmbed(message, message.author.id, 2)
            }


        } else {
            
            modules.sendFractionEmbed(message, message.author.id, 2)
        }


    }
}