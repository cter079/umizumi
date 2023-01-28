const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dog')
        .setDescription('Get a random dog image/gif'),
    async execute(interaction) {
    const response = await fetch('https://random.dog/woof.json');
    const json = await response.json();
    const embed = new EmbedBuilder()
        .setTitle('Dog')
        .setImage(json.url)
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp();
    interaction.reply({ embeds: [embed] });
}
};
