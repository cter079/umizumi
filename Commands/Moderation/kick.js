const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');
const { EmbedBuilder } = require('@discordjs/builders');
const Server = require('../Database/Models/server.js');
const {Permissions} = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user')
        .addUserOption(option => option.setName('user').setDescription('The user to kick').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the kick').setRequired(false)),
    async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const member = interaction.guild.members.cache.get(user.id);
    const logChannel = await Server.findOne({id: interaction.guild.id});
    const log = interaction.guild.channels.cache.get(logChannel.logChannel);
    const bot = interaction.guild.members.cache.get(interaction.client.user.id);

//check if the user has permission to kick members
if(!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return interaction.reply({content: 'You do not have permission to kick members', ephemeral: true});
if(!bot.permissions.has(PermissionsBitField.Flags.KickMembers)) return interaction.reply({content: 'I do not have permission to kick members', ephemeral: true});







    if(member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({content: 'You cannot kick this member', ephemeral: true});

    await member.kick({reason: reason});
    const embed = new EmbedBuilder()
        .setTitle(`Kicked ${user.tag}`)
        .setDescription(`${reason ? `for ${reason}` : ''}`)
        .setColor(0x00AE86)
        .setTimestamp()
        .setFooter({
            text: `Command Requested by: ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL()
        });
    interaction.reply({embeds: [embed]});
    setTimeout(() => {
        interaction.deleteReply();
    }
    , 500);
    if(log){
    log.send({embeds: [embed]});
    }
}
};




