const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, PermissionsBitField } = require('discord.js');
const { EmbedBuilder } = require('@discordjs/builders');
const Server = require('../Database/Models/server.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Unlock a channel'),
    async execute(interaction) {

    const channel = interaction.channel;
    const logChannel = await Server.findOne({ id: interaction.guild.id });
    const log = interaction.guild.channels.cache.get(logChannel.logChannel);

    if (!interaction.member.permissions.has('MANAGE_CHANNELS')) {
        return interaction.reply({ content: 'You do not have permission to unlock this channel', ephemeral: true });
    }
    const everyoneRole = channel.guild.roles.cache.find(role => role.name === "@everyone");
    channel.permissionOverwrites.set([
        {
          id: everyoneRole.id,
          allow: [PermissionsBitField.Flags.SendMessages],
        }
      ])
    const embed = new EmbedBuilder()
        .setTitle('Unlock')
        .setDescription(`Unlocked channel ${channel}`)
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

