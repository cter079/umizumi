const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gif')
        .setDescription('Search for a gif')
        .addStringOption(option => option.setName('query').setDescription('The query to search for').setRequired(true)),
    async execute(interaction) {
    const query = interaction.options.getString('query');
    const response = await fetch(`https://api.tenor.com/v2/search?q=${query}&key=${process.env.TENOR_KEY}`);
    const json = await response.json();
    const random = Math.floor(Math.random() * json.results.length);
    interaction.reply({content: json.results[random].url});
}
};


