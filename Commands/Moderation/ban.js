const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');
const { EmbedBuilder } = require('@discordjs/builders');
const Server = require('../Database/Models/server.js');
const {Permissions} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user')
        .addUserOption(option => option.setName('user').setDescription('The user to ban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the ban').setRequired(false)),
    async execute(interaction) {
        //get the log channel from the database
        const server = await Server.findOne({id: interaction.guild.id});
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');
        const log = interaction.guild.channels.cache.get(server.logChannel);
        const bot = interaction.guild.members.cache.get(interaction.client.user.id);

  if(!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.reply({content: 'You do not have permission to ban members', ephemeral: true});
  //check if the bot has permission to ban members
  if(!bot.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.reply({content: 'I do not have permission to add roles to members', ephemeral: true});

    

    const member = interaction.guild.members.cache.get(user.id);
    if(member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({content: 'You cannot ban this member', ephemeral: true});

    await member.ban({reason: reason});
    const embed = new EmbedBuilder()
        .setTitle(`Banned ${user.tag}`)
        .setDescription(`${reason ? `for ${reason}` : ''}`)
        .setColor(0x00AE86)
        .setTimestamp()
        .setFooter({
            text: `Command Requested by: ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL()
        });
//send the embed to the log channel
    if(log){
        log.send({embeds: [embed]});
    }
    interaction.reply({embeds: [embed]});
    setTimeout(() => {
        interaction.deleteReply();
    }
    , 500);

}
};

