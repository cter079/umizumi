//convert code to commonjs  
const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("@discordjs/builders");
const User = require('../Database/Models/user.js');
const Server = require('../Database/Models/server.js');
const {Permissions, PermissionsBitField} = require("discord.js");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a member')
        .addUserOption(option => option.setName('user').setDescription('The user to warn').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the warning').setRequired(false)),

    async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const logChannel = await Server.findOne({id: interaction.guild.id});
    const log = interaction.guild.channels.cache.get(logChannel.logChannel);
    const bot = interaction.guild.members.cache.get(interaction.client.user.id);


    if(!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return interaction.reply({content: 'You do not have permission to warn members', ephemeral: true});
    if(!bot.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return interaction.reply({content: 'I do not have permission to warn members', ephemeral: true});

    const member = interaction.guild.members.cache.get(user.id);
    if(member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({content: 'You cannot warn this member', ephemeral: true});

    await member.send({content: `You have been warned in ${interaction.guild.name} for ${reason ? reason : 'no reason'}`});
    const embed = new EmbedBuilder()
        .setTitle(`Warned ${user.tag}`)
        .setDescription(`${reason ? `for ${reason}` : ''}`)
        .setColor(0x00AE86)
        .setTimestamp()
        .setFooter({
            text: `Command Requested by: ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL()
        });

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



