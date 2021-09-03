var modules = require("../modules")

var { MessageEmbed } = require('discord.js')
var npmmodules = require("../npm-modules")

var discordEmbeds = require("../discord-embeds")

var config = require("../config.json")
require("../ExtendedMessage");

module.exports = {
    roles: [],
    prefixes: ["claim", "vyzvednout"],
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
            messageCount = data.messageCount
            type = data.type
            claimedDaily = data.claimedDaily
            leaveDate = data.leaveDate
        })

        if(type === "free") return message.inlineReply(discordEmbeds.warning("Pozor", "Nejsi připojen v žádné z frakcí."))
        if(type === "The Wardens") return message.inlineReply(discordEmbeds.warning("Pozor", "Tvá frakce nemá žádné výhody za zprávy."))

        console.log(messageCount)
        if(messageCount < 150) return message.inlineReply(discordEmbeds.warning("Chyba", `Tvou aktivní odměnu ještě není možné vyzvednout, nesplňuješ potřebný počet zpráv.`))
        if(claimedDaily) return message.inlineReply(discordEmbeds.warning("Chyba", `Dnes sis už svou odměnu vybral/a. Ale stav se zítra!`))

        var claim = new MessageEmbed()
        .setTitle('Odměna za aktivitu byla přijata!')
        .setDescription(`Využil/a jsi aktivní výhodu své frakce, na nové použití si počkej do zítřka.`)

        var iron = Math.ceil(Math.random() * 40) + 20
        var sulfur = Math.ceil(Math.random() * 30) + 10
        var bitcoin = Math.ceil(Math.random() * 25) + 25
        var dollars = Math.ceil(Math.random() * 50) + 50
        var futura = 1

        if(type === "Terraq") {
            await modules.mongodb.collections.frakce.findOneAndUpdate({user_id: message.author.id}, {$set: {claimedDaily: true}})
            await modules.mongodb.collections.items.insertMany([{user_id: databaseUser._id, item_id: 1, count: iron}, {user_id: databaseUser._id, item_id: 2, count: sulfur}])
            claim.addField('Získáno:', `${iron} železa 🍳 a ${sulfur} síry 🧀`)

        }
        else if(type === "Cryptos") {
            await modules.mongodb.collections.frakce.findOneAndUpdate({user_id: message.author.id}, {$set: {claimedDaily: true}})
            await modules.mongodb.collections.items.insertOne({user_id: databaseUser._id, item_id: 5, count: bitcoin})
            claim.addField('Získáno:', `${bitcoin} bitcoinů ₿`)
        }

        else if(type === "UMCG") {
            await modules.mongodb.collections.frakce.findOneAndUpdate({user_id: message.author.id}, {$set: {claimedDaily: true}})
            await modules.mongodb.collections.items.insertOne({user_id: databaseUser._id, item_id: 0, count: dollars})
            claim.addField('Získáno:', `${dollars} G$ 💵`)
        }

        else if(type === "Futura") {
            await modules.mongodb.collections.frakce.findOneAndUpdate({user_id: message.author.id}, {$set: {claimedDaily: true}})
            await modules.mongodb.collections.items.insertOne({user_id: databaseUser._id, item_id: 4, count: futura})
            claim.addField('Získáno:', `${futura} výzkum 🧪`)

        }

        return message.inlineReply(claim)
    

    }
}