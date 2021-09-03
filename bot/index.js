var npmmodules = require("./npm-modules")

require("./ExtendedMessage");

var modules = require("./modules")

var config = require("./config.json")

var discordEmbeds = require("./discord-embeds")

const { MessageEmbed } = require('discord.js')

const mongo = require('./modules/mongodb')
const { user } = require("./modules/discord-client")

require('discord-buttons')(modules.discordClient)
const { MessageButton } = require('discord-buttons')

// wardens [fraction] options
var whatProblem
var randomTimeHours = 20
var randomTimeMinutes = 58
var str
var solvers
var joinedSolversIDs = []
var willGet
let embedType
var problemTime
var wardensDescription
var wardensMessageData

var wardensClaim
var wardensFailed
var solversBool = false


var minutesToAdd = 15

var strTime 

let embedButton = new MessageButton()
    .setStyle('3')
    .setLabel('Vyřešit')
    .setID('solvebutton')



// another code

modules.discordClient.on("message", async (message) => {

    if (message.channel.type === 'news')
        message.crosspost()

    if(message.content.startsWith(config.discord.bot.prefix))
        message.args = message.content.slice(config.discord.bot.prefix.length, message.content.length).split(" ")
    else
        message.args = message.content.split(" ")

    if(message.author.bot)
        return

    if(message.channel.type == "dm")
        modules.sendAdvertisionEmbed(message)

    if(message.channel.type == "dm")
        return
    
    var databaseUser = await modules.mongodb.collections.users.findOne({discord_id: message.author.id})
    if(!databaseUser){

        let inserted = await modules.mongodb.collections.users.insertOne({discord_id: message.author.id})

        if((await modules.mongodb.collections.users.find({discord_id: message.author.id}).toArray()).length > 2){
            await modules.mongodb.collections.users.deleteOne({_id: inserted.insertedId})
        }

        databaseUser = await modules.mongodb.collections.users.findOne({discord_id: message.author.id})

    }

    if(message.content.startsWith(config.discord.bot.prefix)){

        let commandFiles = npmmodules.fs.readdirSync("./discord-commands")

        commandFiles.forEach(commandFile => {

            var command = require(`./discord-commands/${commandFile}`)

            if(!command.prefixes.includes(message.args[0].toLowerCase()))
                return

            if(command.permissions){

                for(var i = 0; i < command.permissions.length; i++){

                    if(!message.member.permissions.has(command.permissions[i])){
    
                        message.reply(discordEmbeds.warning("Na toto nemáš oprávnění", `Potřebné oprávnění: ${commandFiles.permissions.join(", ")}`))
                        return
    
                    }
    
                }

            }
            
            if(command.roles){

                for(var i = 0; i < command.roles.length; i++){

                    if(!message.member.roles.cache.get(command.roles[i])){
    
                        var rolesString = ""

                        command.roles.forEach(role => {
                            rolesString += "<@&" + role + "> "
                        })

                        message.reply(discordEmbeds.warning("Na toto nemáš oprávnění", `Potřebné role: ${rolesString}`))
                        return
    
                    }
    
                }

            }
            

            command.execute(message, databaseUser)

        })

    }
    
    if(!message.content.startsWith(config.discord.bot.prefix)) modules.addPointsFromMessage(databaseUser._id, message)

})

// počítání
modules.discordClient.on("message", async (message, databaseUser) => {
    // check if message is sent into channel "pocitani"
    if(message.channel.id === "818932276301266965") {
        if(isNaN(message.content)) return

        if(message.author.bot) return

        if(message.channel.type == "dm") return

        if(message.content === ".r-p" || message.content === ".resetovat-pocitani") return

                let usid
                let count
                const counting = await modules.mongodb.collections.counts.find({ido: "1"}).toArray()
    
                counting.forEach(uid => {
                    usid = uid.user_id
                    count = parseInt(uid.counting)
                })

                if(usid === message.author.id) {
                    let vedle = new npmmodules.Discord.MessageEmbed()
                        .setTitle('❌ Pozor!')
                        .setDescription(`Nemůžeš počítat sám se sebou, počkej na nějakého dalšího profíka.`)
                    message.react('❌')
                    message.reply(vedle).then(msg => {
                        msg.delete({ timeout: 5000 })
                      })
                    message.delete({ timeout: 5000 })
                    return
                }

                
        if(Number(message.content) === count + 1) {

                count++
                modules.mongodb.collections.counts.findOneAndUpdate({ido: "1"}, {$set: {user_id: message.author.id, counting: count}})
    
                message.react('✅')
                return

        } else if(!message.author.bot) {
            let nick = message.guild.members.cache.get(message.author.id).nickname
            if(nick === null) nick = message.author.username
            let vedle = new npmmodules.Discord.MessageEmbed()
                .setTitle('❌ Vedle!')
                .setDescription(`Správná odpověď byla ${count + 1}, nyní se počítá od **1**!\n*Můžete poděkovat našemu milovanému členu \`${nick}\`*`)
            message.react('❌')
            message.reply(vedle)
            count = 0
            modules.mongodb.collections.counts.findOneAndUpdate({ido: "1"}, {$set: {user_id: message.author.id, counting: count}})
        }
    } else {
        return
    }
})


// slovni fotbal
modules.discordClient.on("message", async (message, databaseUser) => {
    // check if message is sent into channel "fotbal"
    if(message.channel.id === "834014237893459969") {

        if(message.author.bot) return

        if(message.channel.type == "dm") return

        if(message.content === ".r-f" || message.content === ".resetovat-fotbal") return

                let lastChar
                let lastCharNow
                let usid
                const fotball = await modules.mongodb.collections.fotbal.find({ido: "1"}).toArray()
    
                fotball.forEach(data => {
                    usid = data.user_id
                    lastChar = data.lastCharacter
                })

                if(usid === message.author.id) {
                    let vedle = new npmmodules.Discord.MessageEmbed()
                        .setTitle('❌ Pozor!')
                        .setDescription(`Nemůžeš hrát sám se sebou, počkej na nějakého dalšího profesionálního češtináře.`)
                    message.react('❌')
                    message.reply(vedle).then(msg => {
                        msg.delete({ timeout: 5000 })
                      })
                    message.delete({ timeout: 5000 })
                    return
                }

                if(lastChar === "none") {
                    if(message.content.length < 3) {
                        let vedle = new npmmodules.Discord.MessageEmbed()
                                .setTitle('❌ Pozor!')
                                .setDescription(`Tohle není slovo. Zkus nějaké jiné`)
                            message.react('❌')
                            message.reply(vedle).then(msg => {
                                msg.delete({ timeout: 5000 })
                              })
                            message.delete({ timeout: 5000 })
                            return
                    }

                    if(WordCount(message.content) > 1) {
                        let vedle = new npmmodules.Discord.MessageEmbed()
                                .setTitle('❌ Pozor!')
                                .setDescription(`Můžeš napsat jen jedno slovo, ne více.`)
                            message.react('❌')
                            message.reply(vedle).then(msg => {
                                msg.delete({ timeout: 5000 })
                              })
                            message.delete({ timeout: 5000 })
                            return
                    }
                    message.react('✅')
                    lastCharNow = message.content.slice(-1)
                    return modules.mongodb.collections.fotbal.findOneAndUpdate({ido: "1"}, {$set: {user_id: message.author.id, lastCharacter: lastCharNow}})
            }

            if(message.content.charAt(0) === lastChar) {

                if(message.content.length < 3) {
                    let vedle = new npmmodules.Discord.MessageEmbed()
                            .setTitle('❌ Pozor!')
                            .setDescription(`Tohle není slovo. Zkus nějaké jiné`)
                        message.react('❌')
                        message.reply(vedle).then(msg => {
                            msg.delete({ timeout: 5000 })
                          })
                        message.delete({ timeout: 5000 })
                        return
                }

                if(WordCount(message.content) > 1) {
                    let vedle = new npmmodules.Discord.MessageEmbed()
                            .setTitle('❌ Pozor!')
                            .setDescription(`Můžeš napsat jen jedno slovo, ne více.`)
                        message.react('❌')
                        message.reply(vedle).then(msg => {
                            msg.delete({ timeout: 5000 })
                          })
                        message.delete({ timeout: 5000 })
                        return
                }
                    lastCharNow = message.content.slice(-1)
                    modules.mongodb.collections.fotbal.findOneAndUpdate({ido: "1"}, {$set: {user_id: message.author.id, lastCharacter: lastCharNow}})
        
                    message.react('✅')
                    return
    
            } else if(!message.author.bot) {
    
                let vedle = new npmmodules.Discord.MessageEmbed()
                    .setTitle('❌ Pozor!')
                    .setDescription(`Zadané slovo \`${message.content}\` nezačíná na písmeno \`${lastChar}\`!`)
                message.react('❌')
                message.reply(vedle).then(msg => {
                    msg.delete({ timeout: 5000 })
                  })
    
                return message.delete({ timeout: 5000 })
              
        } else return


    }


    if(message.author.bot) return

    if(message.channel.type == "dm") return

    if(message.length < 2) return

    if(message.content.startsWith(config.discord.bot.prefix)) return

    // ----------------------------------------------------------------------------------------------------------------------------------------------------------- //
    // -------------------------------------------------------------------- FRACTION MESSAGES -------------------------------------------------------------------- //
    // ----------------------------------------------------------------------------------------------------------------------------------------------------------- //

    const fraction = await modules.mongodb.collections.frakce.find({user_id: message.author.id}).toArray()

    if(fraction.length < 1) {
        await modules.mongodb.collections.frakce.insertOne({user_id: message.author.id, type: "free", messageCount: null, lastMessage: new Date(), claimedDaily: false, leaveDate: "never"})

    } else {

        var lastDate
        var messageCount
        var typeFraction

        fraction.forEach(data => {
            typeFraction = data.type
            lastDate = data.lastMessage
            messageCount = data.messageCount
        })
        

        let timeout = 10000
        if(lastDate != null && timeout - (Date.now() - lastDate) > 0) return

        
        if(messageCount == null) messageCount = 0

        modules.mongodb.collections.frakce.findOneAndUpdate({user_id: message.author.id}, {$set: {lastMessage: new Date(), messageCount: (messageCount + 1)}})

        if(messageCount == 150) {
            if(typeFraction == 'free' || typeFraction == 'The Wardens') return

            var active = new MessageEmbed()

            if(typeFraction == 'Terraq') active.setColor('0xddbe11').setThumbnail('https://imgur.com/wpJ5bwo.png').setTitle('Dobrá práce!').setDescription(`Splnil/a jsi potřebnou aktivitu pro aktivaci výhody frakce Terraq. Odměnu si můžeš vyzvednout pomocí příkazu \`${config.discord.bot.prefix}vyzvednout\``)
            if(typeFraction == 'UMCG') active.setColor('0xffffff').setThumbnail('https://imgur.com/gy2wAL4.png').setTitle('Jsi o kousek blíž našemu cíli!').setDescription(`Splnil/a jsi potřebnou aktivitu pro aktivaci výhody frakce UMCG. Odměnu si můžeš vyzvednout pomocí příkazu \`${config.discord.bot.prefix}vyzvednout\``)
            if(typeFraction == 'Futura') active.setColor('0x74f740').setThumbnail('https://imgur.com/8OV0OEJ.png').setTitle('Vynikající pokrok!').setDescription(`Splnil/a jsi potřebnou aktivitu pro aktivaci výhody frakce Futura. Odměnu si můžeš vyzvednout pomocí příkazu \`${config.discord.bot.prefix}vyzvednout\``)
            if(typeFraction == 'Cryptos') active.setColor('0xddbe11').setThumbnail('https://imgur.com/wpJ5bwo.png').setTitle('Jen tak dál!').setDescription(`Splnil/a jsi potřebnou aktivitu pro aktivaci výhody frakce Cryptos. Odměnu si můžeš vyzvednout pomocí příkazu \`${config.discord.bot.prefix}vyzvednout\``)

            return message.inlineReply(active)
        }

    }


})



    // --------------------------------------------------------------------------------------------------------------------------------------------------------- //
    // --------------------------------------------------------------------- CLIENT READY ---------------------------------------------------------------------- //
    // --------------------------------------------------------------------------------------------------------------------------------------------------------- //

modules.discordClient.on("ready", async () => {
    console.log("====================");
    console.log("Discord bot started");
    console.log("====================");


    modules.discordClient.user.setPresence({
        status: 'online',
        activity: {
            name: config.discord.bot.prefix + 'help',
            type: 'LISTENING'
        }
    })
    
    var thisMessage = await modules.discordClient.guilds.cache.first().channels.cache.get(config.discord.fractions.wardensRoomHQ).messages.fetch(config.discord.fractions.wardensHQmessageID)

    setInterval(async() => {

        if(new Date().getMinutes() == 0 && new Date().getSeconds() == 0){
            modules.addHourlyItems()
        }


        if(new Date().getHours() === 22 && new Date().getMinutes() === 0 && new Date().getSeconds() == 0) {

            const fraction = await modules.mongodb.collections.frakce.find({}).toArray()
            fraction.forEach(async data => {
                if(data.messageCount == null) return
                await modules.mongodb.collections.frakce.findOneAndUpdate({user_id: data.user_id}, {$set: {messageCount: 0, claimedDaily: false}})
            })
            console.log('reseted message count in database for fractions.')
            console.log('-------------------------------------------------')

            str = ""
            randomTimeHours = Math.floor(Math.random() * 12) + 9
            randomTimeMinutes = Math.ceil(Math.random())
            if(randomTimeMinutes % 2 === 0) randomTimeMinutes = 00
            else randomTimeMinutes = 30


            str = randomTimeHours.toString() + ':' + randomTimeMinutes.toString()

            embedType = new MessageEmbed()

            whatProblem = Math.floor(Math.random() * 6)
            
            strTime = ''
            strTime = randomTimeHours.toString() + ':' + (randomTimeMinutes + minutesToAdd).toString()



            if(whatProblem == 0) {
                solvers = 6
                willGet = 180
                wardensDescription = `__**Skenery zachytily pás asteroidů v nebezpečné blízkosti VS!**__\nJe potřeba aktivovat zbraňové systémy, zjistit, které asteroidy je potřeba zničit, a eliminaci hrozeb potvrdit u velení.\n\nČas ukončení: **${strTime}**\nPočet vyžadovaných strážců: **${solvers}**\nOdměna: **${willGet} G$ pro každého**\n\n__Aktivní Strážci:__`
                embedType.setTitle('❗️POHOTOVOST❗️').setDescription(wardensDescription).setColor('0xff0000').setImage(`https://c4.wallpaperflare.com/wallpaper/667/770/431/asteroids-wallpaper-preview.jpg`).setThumbnail(`https://imgur.com/AatVkbf.png`).setFooter(`Ochranný systém Vesmírného Střediska`).setAuthor(`The Wardens`, `https://imgur.com/dGhIiCN.png`)

            } else if(whatProblem == 1) {
                solvers = 3
                willGet = 90
                wardensDescription = `__**Jeden z astronautů je uvězněn v porouchané tlakové komoře!**__\nJe potřeba komoru restartovat do továrního nastavení a astronauta odtamtud vyprostit.\n\nČas ukončení: **${strTime}**\nPočet vyžadovaných strážců: **${solvers}**\nOdměna: **${willGet} G$ pro každého**\n\n__Aktivní Strážci:__`
                embedType.setTitle('❗️POHOTOVOST❗️').setDescription(wardensDescription).setColor('0xff0000').setImage(`https://cdnb.artstation.com/p/assets/images/images/017/514/795/medium/orest-tsypiashchuk-screenshot003.jpg?1556285005`).setThumbnail(`https://imgur.com/AatVkbf.png`).setFooter(`Ochranný systém Vesmírného Střediska`).setAuthor(`The Wardens`, `https://imgur.com/dGhIiCN.png`)

            } else if(whatProblem == 2) {
                solvers = 2
                willGet = 60
                wardensDescription = `__**Je čas vyrazit na pravidelnou kontrolu VS!**__\nHlídku tvoří dva členové, příruční zbraně s sebou.\n\nČas ukončení: **${strTime}**\nPočet vyžadovaných strážců: **${solvers}**\nOdměna: **${willGet} G$ pro každého**\n\n__Aktivní Strážci:__`
                embedType.setTitle('❗️KLASICKÁ PATROLA❗️').setDescription(wardensDescription).setColor('0xff0000').setImage('https://i.pinimg.com/originals/25/a6/62/25a66221fb2ea28c66b75344c9e6c1cc.jpg').setThumbnail(`https://imgur.com/AatVkbf.png`).setFooter(`Ochranný systém Vesmírného Střediska`).setAuthor(`The Wardens`, `https://imgur.com/dGhIiCN.png`)

            } else if(whatProblem == 3) {
                solvers = 2
                willGet = 160
                wardensDescription = `__**Noví obyvatelé střediska se podle všeho ztratili!**__\nV jednom ze zákoutí VS se potulují zmatení \"vesmírní turisté\", neví kudy kam a potřebují pomoc.\n\nČas ukončení: **${strTime}**\nPočet vyžadovaných strážců: **${solvers}**\nOdměna: **${willGet} G$ pro každého**\n\n__Aktivní Strážci:__`
                embedType.setTitle('❗️POHOTOVOST❗️').setDescription(wardensDescription).setColor('0xff0000').setImage(`https://wallpaperboat.com/wp-content/uploads/2020/10/23/57899/question-mark-01.jpg`).setThumbnail(`https://imgur.com/AatVkbf.png`).setFooter(`Ochranný systém Vesmírného Střediska`).setAuthor(`The Wardens`, `https://imgur.com/dGhIiCN.png`)

            } else if(whatProblem == 4) {
                solvers = 4
                willGet = 120
                wardensDescription = `__**Systémy střediska byly napadeny hackery!**__\nStačila jedna flashka nepozorného zaměstnance a už máme zašifrovanou hromadu dat. Ale naštěstí je cesta, jak se kyber-útoku ubránit. Vyražte do serverovny a data dešifrujte!\n\nČas ukončení: **${strTime}**\nPočet vyžadovaných strážců: **${solvers}**\nOdměna: **${willGet} G$ pro každého**\n\n__Aktivní Strážci:__`
                embedType.setTitle('❗️POHOTOVOST❗️').setDescription(wardensDescription).setColor('0xff0000').setImage(`https://www.enjpg.com/img/2020/hacker-16.jpg`).setThumbnail(`https://imgur.com/AatVkbf.png`).setFooter(`Ochranný systém Vesmírného Střediska`).setAuthor(`The Wardens`, `https://imgur.com/dGhIiCN.png`)

            } else {
                solvers = 5
                willGet = 150
                wardensDescription = `__**Máme tu hlášení situace s rukojmími!**__\nNěkolik vesmírných pirátů obsadilo únikovou buňku s ukradeným zbožím, a jejich cestu jim zajišťují rukojmí. Piráti jsou ozbrojeni lehkou palebnou silou, dle hlášení tu máme tři podzeřelé... \n\nZablokujte únikové doky a vyřešte situaci dle protokolů, příruční zbraně s sebou.\n\nČas ukončení: **${strTime}**\nPočet vyžadovaných strážců: **${solvers}**\nOdměna: **${willGet} G$ pro každého**\n\n__Aktivní Strážci:__`
                embedType.setTitle('❗️POHOTOVOST❗️').setDescription(wardensDescription).setColor('0xff0000').setImage(`https://cdnb.artstation.com/p/assets/images/images/028/544/509/large/jack-t-rex-hoyle-gun-fight-flat.jpg?1594772786`).setThumbnail(`https://imgur.com/AatVkbf.png`).setFooter(`Ochranný systém Vesmírného Střediska`).setAuthor(`The Wardens`, `https://imgur.com/dGhIiCN.png`)

            }

            wardensClaim = new MessageEmbed()
            .setTitle('✅Problém vyřešen✅')
            .setDescription(`Váš úkol byl splněn, nádherná spolupráce!\n\nVýše výplaty na osobu: **${willGet} G$**\n\n__Další problém očekávejte zítra, v 00:00 dostanete čas a počet řešitelů.__`)
            .setColor('0x5ad744')
            .setThumbnail(`https://ownacademy.co/wp-content/uploads/2018/10/Tick_Mark_Dark-512.png`)
            .setAuthor('The Wardens', `https://imgur.com/dGhIiCN.png`)
            .setFooter('Ochranný systém Vesmírného Střediska')


            wardensFailed = new MessageEmbed()
            .setTitle(':x:Problém nebyl vyřešen:x:')
            .setDescription(`Váš úkol nebyl splněn, tak snad příště!\n\n__Další problém očekávejte zítra, v 00:00 dostanete čas a počet řešitelů.__`)
            .setColor('0xFF0000')
            .setThumbnail(`https://imgur.com/N2CtFrk.png`)
            .setAuthor('The Wardens', `https://imgur.com/dGhIiCN.png`)
            .setFooter('Ochranný systém Vesmírného Střediska')


            problemTime = new MessageEmbed()
            .setTitle(`⚠️Upozornění⚠️`)
            .setDescription(`Dle našich zdrojů dnes na středisku nastane problém v **${str}**\n\nPotřební řešitelé: **${solvers}**\n\nNa vyřešení problému pomocí reakcí budete mít 15 minut, doporučujeme si předem domluvit vyřešení v týmu.`)
            .setColor('0xffe600')
            .setImage(`https://vistapointe.net/images/caution-4.jpg`)
            .setThumbnail(`https://imgur.com/N2CtFrk.png`)
            .setAuthor(`The Wardens`, 'https://imgur.com/dGhIiCN.png')
            .setFooter(`Ochranný systém Vesmírného Střediska`)

            thisMessage.edit(problemTime)
        }
        

        if(new Date().getHours() === (randomTimeHours-2) && new Date().getMinutes() === randomTimeMinutes && new Date().getSeconds() == 00) {
            joinedSolversIDs = []
            solversBool = false
            modules.discordClient.guilds.cache.first().channels.cache.get(config.discord.fractions.wardensRoomHQ).send(embedType, embedButton).then(msg => {
                wardensMessageData = msg
            })
        }

        if(joinedSolversIDs.length == solvers && solversBool == false && new Date().getMinutes() < (randomTimeMinutes + minutesToAdd)) {
            wardensMessageData.delete()

            for(var y=0; y<joinedSolversIDs.length;y++) {
                if(willGet==undefined) return
                await modules.mongodb.collections.items.insertOne({user_id: modules.getIDFromDiscordID(joinedSolversIDs[y]), item_id: 0, count: willGet})
            }

            thisMessage.edit(wardensClaim)
            solversBool = true
        }


        if(new Date().getMinutes() === (randomTimeMinutes + minutesToAdd) && solversBool == false && joinedSolversIDs.length < solvers) {
            wardensMessageData.delete()
            thisMessage.edit(wardensFailed)
            solversBool = true
        }



        ///////////////////////////////////////////////////////////////////////////////
        if(new Date().getSeconds() === 0){
            modules.updateChannelsStatus()
            modules.deleteUsersInactiveChannels()
            modules.remindVotes()
        }

        modules.removeMutes()

        if(new Date().getSeconds().toString().endsWith("0")){
            modules.rewardVoiceActivity()
        }

    }, 1000);
    

    var bitcoinGameRounds = 0
    async function runBitcoinGame(){
        if(bitcoinGameRounds > 0)
            await modules.bitcoinMiningGame()
        bitcoinGameRounds++
        setTimeout(runBitcoinGame, 120000);
    }
    runBitcoinGame();

    var droidGameRounds = 0
    async function runDroidGame(){
        if(droidGameRounds > 0)
            await modules.droidGame()
        droidGameRounds++
        setTimeout(runDroidGame, Math.floor(Math.random() * 600000));
    }
    runDroidGame()

})

// on button click

modules.discordClient.on('clickButton', async button => {
    if(button.id === "solvebutton") {

        if(joinedSolversIDs.length == 0) {} else { if(joinedSolversIDs.includes(button.clicker.user.id)) return }
        await button.clicker.fetch();

        joinedSolversIDs.push(button.clicker.user.id)
        wardensDescription = wardensDescription + `\n<@${button.clicker.user.id}>`
        embedType.setDescription(wardensDescription)
        wardensMessageData.edit(embedType)

    }
})

// on member join

modules.discordClient.on("guildMemberAdd", member => {
    modules.discordClient.guilds.cache.first().channels.cache.get(config.discord.guild.joinRoom).send(`<@${member.id}> *se připojil na server!*`)

    member.send("Děkujeme, že ses připojil na náš server <:VSlove:870587522076524555>\n\n**PRO ZOBRAZENÍ MÍSTNOSTÍ NA SERVERU KLIKNI NA REAKCI V PRAVIDLECH**").catch(() => {})
    modules.sendHelpEmbed(member)
})

// on member leave

modules.discordClient.on("guildMemberRemove", member => {
    modules.discordClient.guilds.cache.first().channels.cache.get(config.discord.guild.leaveRoom).send(`**\`\`${member.user.tag}\`\`** opustil server!`)
})

// on reaciton add

modules.discordClient.on("raw", event => {
    if(event.t == "MESSAGE_REACTION_ADD"){
        if(event.d.channel_id == config.discord.guild.helpRoom)
            modules.newHelpRoom(event)
        if(event.d.channel_id == config.discord.guild.newChannelsChannel)
            modules.newUsersChannel(event)
    }
})

// on message

modules.twitchClient.on("message", async (target, context, msg, self) => {
    if(self)
        return

    if(msg.startsWith(config.discord.bot.prefix))
        var args = msg.slice(config.discord.bot.prefix.length, msg.length).split(" ")
    else
        var args = msg.split(" ")

    var databaseUser = await modules.mongodb.collections.users.findOne({twitch_id: context['user-id']})

    if(msg.startsWith(config.discord.bot.prefix)){
        let commandFiles = npmmodules.fs.readdirSync("./twitch-commands")

        commandFiles.forEach(commandFile => {

            var command = require(`./twitch-commands/${commandFile}`)

            if(!command.prefixes.includes(args[0].toLowerCase()))
                return

            
            if(command.requiresLogin && !databaseUser){

                modules.twitchClient.say(target, "@" + context["display-name"] + ", Na provedení této akce musíš být přihlášený na naší stránce. Jdi na https://stredisko.space, přihlaš se přes Discord a propoj si účet s Twitchem.")
                return

            }

            command.execute(target, context, msg, self, databaseUser, args)

        })
    }
})

// just adds points every 10 seconds

setInterval(() => {
    modules.addPointsFromWatching()
}, 10000);

// gets word count in a string

function WordCount(str) { 
    return str.split(" ").length;
  }
