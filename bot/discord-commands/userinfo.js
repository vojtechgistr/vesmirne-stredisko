var modules = require("../modules")

var { MessageEmbed } = require('discord.js')

var npmmodules = require("../npm-modules")

var discordEmbeds = require("../discord-embeds")

var config = require("../config.json")
const mongodb = require("../modules/mongodb")

const moment = require('moment')

var cyan = '#00FFFF'

module.exports = {
    roles: [config.discord.guild.moderatorRole],
    prefixes: ["ui", "userinfo"],
    execute: async function(message, databaseUser){

        if(message.channel.type === "dm") return;
        
        const embed2 = new MessageEmbed()
        .setTitle(':x: Error :x:')
        .setDescription("You don't have enough permissions to use this command. \n - Required permission -> ``MANAGE MESSAGES``")
        .setColor(0xd12828)
        .setTimestamp();

        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            message.channel.send(embed2)
            .then(m => m.delete({ timeout: 7000 }));
            message.delete({ timeout: 7000 });
            return;
        }

        let invalid = new MessageEmbed()
            .setDescription("Enter valid id or username!")
            .setColor(cyan);
        
        let cannotfind = new MessageEmbed()
            .setDescription("User is not on this server!")
            .setColor(cyan);

        let botuserlmao = new MessageEmbed()
            .setDescription("Bot is not a real person! Try someone else..")
            .setColor(cyan);


    let user = await message.guild.members.fetch(message.args[1])
    
    if(!message.args[1]) {
        message.channel.send(invalid)
        .then(m => m.delete({ timeout: 30000 }));
            message.delete({ timeout: 30000 });
            return;
    }

    if(!user) {
         message.channel.send(cannotfind)
        .then(m => m.delete({ timeout: 30000 }));
    message.delete({ timeout: 30000 });
    return;
    }

    if(user.user.bot) {
        message.channel.send(botuserlmao)
        .then(m => m.delete({ timeout: 30000 }));
            message.delete({ timeout: 30000 });
            return;
    }

    let status = user.presence.status;

    if(status === "idle") status = "Idle"
    if(status === "dnd") status = "DND"
    if(status === "online") status = "Online"
    if(status === "offline") status = "Offline"
    if(status === "invisible") status = "Invisible"
    if(status === "streaming") status = "Streaming"
    

    let sEmbed = new MessageEmbed()
        .setColor(cyan)
        .setTitle("User Informations)")
        .setThumbnail(user.user.displayAvatarURL())
        .addField("**Name:**", `${user.user.username}`, false)
        .addField("**Tag:**", `${user.user.discriminator}`, false)
        .addField("**ID:**", `${user.user.id}`, false)
        .addField("**Database ID:**", `${await modules.getIDFromDiscordID(user.user.id)}`, false)
	    .addField("**Avatar:**", `[Link to avatar](${user.user.displayAvatarURL({ dynamic: true })})`, false)
        .addField("**Status:**", `${status}`, false)
        .addField("**Game:**", `${user.presence.game || 'Not playing a game'}`, false)
        .addField('\u200b', '\u200b')
        .addField("**Joined on this server:**", moment(message.member.guild.members.cache.get(user.id).joinedAt).format("MMMM Do YYYY, h:mm:ss a"), false)
        .addField("**Account Created at:**", moment(message.member.guild.members.cache.get(user.id).user.createdAt).format("MMMM Do YYYY, h:mm:ss a"), false)
        .setFooter(`Requested by ${message.author.username}#${message.author.discriminator}`, message.author.displayAvatarURL());
    message.channel.send(sEmbed);
    }
}