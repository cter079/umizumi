const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, PermissionsBitField } = require('discord.js');
const { Collection } = require('discord.js');
const Server = require('../Database/Models/server.js');
const { EmbedBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addrole')
        .setDescription('Add a role to a user')
        .addUserOption(option => option.setName('user').setDescription('The user to add the role to').setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription('The role to add to the user').setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const role = interaction.options.getRole('role');
        const bot = interaction.guild.members.cache.get(interaction.client.user.id);
        const logChannel = await Server.findOne({id: interaction.guild.id});
        const log = interaction.guild.channels.cache.get(logChannel.logChannel);

    if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) return interaction.reply({content: 'You do not have permission to add roles to members', ephemeral: true});
if(!bot.permissions.has(PermissionsBitField.Flags.ManageRoles)) return interaction.reply({content: 'I do not have permission to add roles to members', ephemeral: true});
    const member = interaction.guild.members.cache.get(user.id);
    if(member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({content: 'You cannot add roles to this member', ephemeral: true});

    await member.roles.add(role);
    const embed = new EmbedBuilder()
        .setTitle(`Added ${role.name} to ${user.tag}`)
        .setColor(0x00AE86)
        .setTimestamp()
        .setFooter({
            text: `Command Requested by: ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL()
        });
    interaction.reply({embeds: [embed]});
    setTimeout(() => {
        interaction.deleteReply();
    }, 500);

    if(log) {
        log.send({embeds: [embed]});
    }

}
};

