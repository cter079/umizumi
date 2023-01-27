import { SlashCommandBuilder } from "discord.js";


export const data = new SlashCommandBuilder()
    .setName('botname')
    .setDescription('Change the server bot name')
    .addStringOption(option => option.setName('name').setDescription('The new name for the bot').setRequired(true));

    export async function execute(interaction) {
        if(!interaction.guild){
            interaction.reply({content: 'This command can only be executed in a server'});
            return;
        }
        const name = interaction.options.getString('name');
        const bot = interaction.guild.members.cache.get(interaction.client.user.id);
        if(!bot){
            interaction.reply({content: 'I am not in this server'});
            return;
        }
        bot.setNickname(name)
            .then(() => interaction.reply({content: `Bot name changed to ${name}`}))
            .catch(console.error);
    }
 
