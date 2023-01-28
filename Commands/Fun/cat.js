const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cat')
        .setDescription('Get a random cat image/gif'),
    async execute(interaction) {
        const response = await fetch('https://aws.random.cat/meow');
        const json = await response.json();
        interaction.reply({content: json.file});
    }
};




