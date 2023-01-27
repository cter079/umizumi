
import {config }from 'dotenv'
import {Client, GatewayIntentBits, PermissionsBitField, Routes, ActivityType, SlashCommandBuilder} from 'discord.js';
import { REST } from '@discordjs/rest';
import { Collection } from 'discord.js';
import json from './replies.json' assert { type: 'json' };
import fs from 'fs';

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

} );







    













  













