var modules = require("../modules")
var npmmodules = require("../npm-modules")
var discordEmbeds = require("../discord-embeds")
var config = require("../config.json")
var embeds = require("../embeds.json")
var { MessageEmbed } = require('discord.js')

module.exports = {
    permissions: [],
    prefixes: ["createembed"],
    execute: async function(message, databaseUser){
        var list = []
        embeds.forEach(data => {
            list.push(data.command)
        });

        if(list.includes(message.args[1]) === true) {

            embeds.forEach(mainData => {

                if(mainData.command === message.args[1]) {

                    if(mainData.type === 0) {

                        let messEmb = new MessageEmbed()
                        .setColor(mainData.embed.color)
                        .setTitle(mainData.embed.title)
                        .setDescription(mainData.embed.description)
                        .setImage(mainData.embed.image.url)
                        .setFooter(mainData.embed.footer.text);

                        if(message.deletable) message.delete()

                        message.channel.send(messEmb);

                    } else if(mainData.type === 1) {

                        let messEmb = new MessageEmbed()
                        .setColor(mainData.embed.color)
                        .setTitle(mainData.embed.title)
                        .setDescription(mainData.embed.description)
                        .setImage(mainData.embed.image.url)
                        .setFooter(mainData.embed.footer.text);

                        var fields = [mainData.embed.fields]
                        let z = 0
                        for(var i = 0;i < mainData.fieldNum; i++) {
                            fields.forEach(fieldData => {
                                z++
                                messEmb.addField(fieldData[z].title, fieldData[z].description, fieldData[z].value)
                            })

                            
                        }

                        if(message.deletable) message.delete()

                        message.channel.send(messEmb);
                        
                    } else {
                        let messEmb = new MessageEmbed()
                        .setColor(mainData.embed.color)
                        .setAuthor(mainData.embed.author, modules.discordClient.user.displayAvatarURL())
                        .setTitle(mainData.embed.title)
                        .setURL(mainData.embed.url)
                        .setDescription(mainData.embed.description)

                        var fields = [mainData.embed.fields]
                        let z = 0
                        for(var i = 0;i < mainData.fieldNum; i++) {
                            fields.forEach(fieldData => {
                                z++
                                messEmb.addField(fieldData[z].title, fieldData[z].description, fieldData[z].value)
                            })

                            
                        }

                        if(message.deletable) message.delete()

                        message.channel.send(messEmb);
                    }
                }
                
            })
                
            
        } else {
            var list = []
            embeds.forEach(data => {
                list.push(data.command)
            })

            var readableList = `**Invalid data format** --- __valid data:__`
            list.forEach(data => {
                readableList =  readableList + '\n- ' + data
            })
            message.channel.send(readableList)
        }
            

    }
}