const {SlashCommandBuilder} = require('@discordjs/builders');
const {EmbedBuilder} = require('@discordjs/builders');
const User = require('../Database/Models/user.js');
const {Permissions, PermissionsBitField} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Purge messages')
        .addIntegerOption(option => option.setName('amount').setDescription('The amount of messages to purge').setRequired(true)),
    async execute(interaction) {
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply('You do not have the permissions to use this command.');
        const amount = interaction.options.getInteger('amount');
        if(amount > 100) return interaction.reply('You can only purge 100 messages at a time.');
        await interaction.channel.bulkDelete(amount, true);
        const embed = new EmbedBuilder()
            .setColor(0x00AE86)
            .setDescription(`Successfully purged ${amount} messages.`)
            .setFooter({text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL()})
        interaction.reply({embeds: [embed]});
        setTimeout(() => {
            interaction.deleteReply();
        }
        , 2000);

    }
};
