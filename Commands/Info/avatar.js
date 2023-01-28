const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Get a user\'s avatar')
        .addUserOption(option => option.setName('user').setDescription('The user\'s avatar to show')),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const embed = new EmbedBuilder()
            .setTitle(`${user.tag}'s avatar`)
            .setImage(user.displayAvatarURL({dynamic: true, size: 512}))
            .setColor(0x00AE86)
            .setTimestamp()
            .setFooter({
                text: `Command Requested by: ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL()
            });
        interaction.reply({embeds: [embed]});
    },
};
