
import {config }from 'dotenv'
import {Client, GatewayIntentBits, PermissionsBitField, Routes, ActivityType, SlashCommandBuilder} from 'discord.js';
import { REST } from '@discordjs/rest';
import { Collection } from 'discord.js';
import json from './replies.json' assert { type: 'json' };
import fs from 'fs';
import User from './Commands/Database/Models/user.js';
import mongoose from 'mongoose';
import Server from './Commands/Database/Models/server.js';
import { EmbedBuilder } from '@discordjs/builders';


const prefix = "/";
const commands = [];
//get the serverinfo command







config();
const token = process.env.TOKEN;
const clientID = process.env.CLIENT_ID;
const guildID = process.env.GUILD_ID;

const rest = new REST({
    version: '9'

}).setToken(token);



const client = new Client({
    allowedMentions: {
        parse: ['users', 'roles'],
        repliedUser: true
    },

    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences]

});







client.infoSlashCommands = new Collection();
const commandFiles = fs.readdirSync('./Commands/Info').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    //use es6 synrax to import the file
    const command = await import(`./Commands/Info/${file}`);
    client.infoSlashCommands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

client.modSlashCommands = new Collection();
const modCommandFiles = fs.readdirSync('./Commands/Moderation').filter(file => file.endsWith('.js'));
for(const file of modCommandFiles){
    const command = await import(`./Commands/Moderation/${file}`);
    client.modSlashCommands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}
client.funSlashCommands = new Collection();
const funCommandFiles = fs.readdirSync('./Commands/Fun').filter(file => file.endsWith('.js'));
for(const file of funCommandFiles){
    const command = await import(`./Commands/Fun/${file}`);
    client.funSlashCommands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}




client.on ('ready', () => {
    console.log('The client is ready!');
   client.user.setPresence({
         activities: [{
                name: 'Bassie en Adriaan',
                type: ActivityType.Watching
            }],
            status: 'online'
        });
    

        client.user.setUsername('Umizumi');

    client.user.setAvatar('https://i.ytimg.com/vi/4QoM-bnASnc/maxresdefault.jpg');

mongoose.connect(`${process.env.CONNECTION_STRING}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to database');
}
).catch((err) => {
    console.log(err);
}
);
});
client.login(token);



    


async function main(){
    try{
        console.log('Started refreshing application (/) commands.');
        await rest.put(
            Routes.applicationGuildCommands(clientID, guildID),
            {body: commands}
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error){
        console.error(error);
    }
}
main();


client.on('interactionCreate', async interaction => {
    if(!interaction.isCommand()) return;

    const {commandName} = interaction;
    const command = client.infoSlashCommands.get(commandName) || client.modSlashCommands.get(commandName) || client.funSlashCommands.get(commandName);



    if(!command) return;

    try{
        await command.execute(interaction);
    } catch (error){
        console.error(error);
        await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
    }
});

client.on('messageCreate', async message => {
    if(message.author.bot) return;
    if(message.content.includes(client.user.id)){
        const replies = json
        const random = Math.floor(Math.random() * replies.length);
        //send the message
        message.reply(replies[random]['reply']);
    }

});

//if user send message add xp
client.on('messageCreate', async message => {
    const randomXp = Math.floor(Math.random() * 9) + 1;
    //add xp to user. if user is not in database add user to database
    const user = await User.findOne({
        userID: message.author.id
    });
    if(!user){
        let newUser = await User.create({
            userID: message.author.id,
            guildID: message.guild.id,
            warns: 0,
            xp: randomXp,
            level: 1
        });
        newUser.save();
    } else {
        user.xp += randomXp;

    }
    //if user has enough xp level up\
    if(user.xp >= 100){
        user.xp = 0;
        user.level += 1;
        user.save();
        const embed = new EmbedBuilder()
        .setTitle('Level up!')
        .setThumbnail(message.author.avatarURL())
        .setDescription(`Congratulations ${message.author} you leveled up to level ${user.level}`)
        .setColor(0x0000ff);



        message.channel.send({embeds: [embed]});



    }
});

//when a new member joins the server
client.on('guildMemberAdd', async member => {
    //get the welcome channel
    const welcomeChannelID = await Server.findOne({
        id: member.guild.id
    });
    const welcomeChannel = member.guild.channels.cache.get(welcomeChannelID.welcomeChannel);
    console.log(welcomeChannelID.welcomeChannel);
    //if there is no welcome channel return
    if(!welcomeChannel) return;
    //send welcome message
    const embed = new EmbedBuilder()
    .setTitle('Welcome!')
    .setThumbnail(member.user.avatarURL())
    .setDescription(`Welcome ${member} to the server!`)
    .setColor(0x0000ff);

    welcomeChannel.send({embeds: [embed]});
});

//when a member leaves the server
client.on('guildMemberRemove', async member => {
    //get the welcome channel
    const welcomeChannelID = await Server.findOne({
        id: member.guild.id
    });
    const welcomeChannel = member.guild.channels.cache.get(welcomeChannelID.leaveChannel);
    //if there is no welcome channel return
    if(!welcomeChannel) return;
    //send welcome message
    const embed = new EmbedBuilder()
    .setTitle('Goodbye!')
    .setThumbnail(member.user.avatarURL())
    .setDescription(`Goodbye ${member}!`)
    .setColor(0x0000ff);

    welcomeChannel.send({embeds: [embed]});
}
);


//when a member says something that includes a word like ping 
client.on('messageCreate', async message => {
    if(message.author.bot) return;
    if(message.content.includes('ping' || 'Ping' || 'PING')){
        message.react('🏓');

    }
    if(message.content.includes('pong' || 'Pong' || 'PONG')){
        message.react('🏓');

    }
    if(message.content.includes('bier' || 'Bier' || 'BIER')){
        message.react('🍺');

    }
    if(message.content.includes('hond' || 'Hond' || 'HOND')){
        message.react('🐶');

    }
    if(message.content.includes('kat' || 'Kat' || 'KAT')){
        message.react('🐱');

    }
    if(message.content.includes('koe' || 'Koe' || 'KOE')){
        message.react('🐮');

    }
    if(message.content.includes('varken' || 'Varken' || 'VARKEN')){
        message.react('🐷');

    }
    if(message.content.includes('hallo' || 'Hallo' || 'HALLO')){
        message.react('👋');

    }
    if(message.content.includes('hoi' || 'Hoi' || 'HOI')){
        message.react('👋');

    }
    if(message.content.includes('hi' || 'Hi' || 'HI')){
        message.react('👋');

    }
    if(message.content.includes('doei' || 'Doei' || 'DOEI')){
        message.react('👋');

    }
    if(message.content.includes('bye' || 'Bye' || 'BYE')){
        message.react('👋');

    }
    if(message.content.includes('cya' || 'Cya' || 'CYA')){
        message.react('👋');

    }
    if(message.content.includes('dag' || 'Dag' || 'DAG')){
        message.react('👋');

    }


});








    








    













  













