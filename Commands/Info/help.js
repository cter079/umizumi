const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get all the commands'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('Help')
            .setDescription('Get all the commands')
            .setColor(0x00AE86)
            .addFields(
                {name: 'Moderator', value: 'Ban, kick, timeout, warn, (un)lock, addrole, unrole, setlog, setcommandchannel, setbye, setwelcome', inline: true},
                {name: 'Info', value: 'Help, serverinfo, userinfo, xp, avatar, invite', inline: true},
                {name: 'Fun', value: 'gif, cat, coinflip, urban, poll, 8ball, dog', inline: true},
            )
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();
        interaction.reply({embeds: [embed]});
    },
};



