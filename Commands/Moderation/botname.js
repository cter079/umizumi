const { SlashCommandBuilder } = require('@discordjs/builders');
const {Permissions, PermissionsBitField} = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('botname')
        .setDescription('Change the server bot name')
        .addStringOption(option => option.setName('name').setDescription('The new name for the bot').setRequired(true)),
    async execute(interaction) {
        const bot = interaction.guild.members.cache.get(interaction.client.user.id);
        if(!interaction.guild){
            interaction.reply({content: 'This command can only be executed in a server'});
            return;
        }

        if(!interaction.member.permissions.has('MANAGE_GUILD')){
            interaction.reply({content: 'You do not have permission to change the bot name'});
            return;
        }
        if(!bot.permissions.has('MANAGE_NICKNAMES')){
            interaction.reply({content: 'I do not have permission to change the bot name'});
            return;
        }


        const name = interaction.options.getString('name');
        if(!bot){
            interaction.reply({content: 'I am not in this server'});
            return;
        }
        bot.setNickname(name)

            .then(() => interaction.reply({content: `Bot name changed to ${name}`}))
            .catch(console.error);
    }
};

