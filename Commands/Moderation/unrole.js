const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('@discordjs/builders');
const Server = require('../Database/Models/server.js');
const { Permissions } = require('discord.js');
const {PermissionsBitField} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unrole')
        .setDescription('Remove a role from a user')
        .addUserOption(option => option.setName('user').setDescription('The user to remove the role from').setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription('The role to remove from the user').setRequired(true)),
    async execute(interaction) {
    const user = interaction.options.getUser('user');
    const role = interaction.options.getRole('role');
    const member = interaction.guild.members.cache.get(user.id);
    const logChannel = await Server.findOne({id: interaction.guild.id});
    const log = interaction.guild.channels.cache.get(logChannel.logChannel);
    const bot = interaction.guild.members.cache.get(interaction.client.user.id);

if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) return interaction.reply({content: 'You do not have permission to remove roles', ephemeral: true});
if(!bot.permissions.has(PermissionsBitField.Flags.ManageRoles)) return interaction.reply({content: 'I do not have permission to remove roles', ephemeral: true});
if(member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({content: 'You cannot remove roles to this member', ephemeral: true});

await member.roles.remove(role);
const embed = new EmbedBuilder()
    .setTitle(`Removed ${role.name} from ${user.tag}`)
    .setColor(0x00AE86)
    .setTimestamp()
    .setFooter({
        text: `Command Requested by: ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL()
    });
interaction.reply({embeds: [embed]});
if(log) {
    log.send({embeds: [embed]});
}
}
};
