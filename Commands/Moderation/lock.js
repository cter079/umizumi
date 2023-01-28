const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, PermissionsBitField } = require('discord.js');
const { EmbedBuilder } = require('@discordjs/builders');
const Server = require('../Database/Models/server.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Lock a channel'),
    async execute(interaction) {
        const channel = interaction.channel;
        const logChannel = await Server.findOne({id: interaction.guild.id});
        const log = interaction.guild.channels.cache.get(logChannel.logChannel);

    //check if user has permission to lock the channel
    if (!interaction.member.permissions.has('MANAGE_CHANNELS')) {
        return interaction.reply({ content: 'You do not have permission to lock this channel', ephemeral: true });
    }
    const everyoneRole = channel.guild.roles.cache.find(role => role.name === "@everyone");

    
    channel.permissionOverwrites.set([
        {
          id: everyoneRole.id,
          deny: [PermissionsBitField.Flags.SendMessages],
      
        }
      ])

    


    const embed = new EmbedBuilder()
        .setTitle('Lock')
        .setDescription(`Locked channel ${channel}`)
        .setColor(0x00AE86)
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp();

//send embed to log channel
if(log){
    await log.send({ embeds: [embed] });
}

await interaction.reply({ embeds: [embed] });
//delete reply after 5 seconds
    setTimeout(() => {
        interaction.deleteReply();
    }
    , 500);




}
};
