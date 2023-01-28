const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('@discordjs/builders');
const {Permissions, PermissionsBitField} = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('Announce something to the server')
        .addStringOption(option => option.setName('message').setDescription('message to announce').setRequired(true))
        .addChannelOption(option => option.setName('channel').setDescription('channel to announce in').setRequired(false)),
    async execute(interaction) {
        const message = interaction.options.getString('message');
        const channel = interaction.options.getChannel('channel');

        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)){
            interaction.reply({content: 'You do not have permission to use this command', ephemeral: true});
            return;
        }
        
    const embed = new EmbedBuilder()
        .setTitle(`Announcement`)
        .setDescription(`${message}`)
        .setColor(0x00AE86)
        .setTimestamp()
        .setFooter({
            text: `Announced by: ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL()
        });

    if(!channel){
        interaction.reply({embeds: [embed]});
    } else {

        channel.send({embeds: [embed]});
    }
}

}
