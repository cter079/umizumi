import { SlashCommandBuilder } from "discord.js";
import fetch from 'node-fetch';

export const data = new SlashCommandBuilder()
    .setName('cat')
    .setDescription('Get a random cat image/gif');

export async function execute(interaction) {
    const response = await fetch('https://aws.random.cat/meow');
    const json = await response.json();
    interaction.reply({content: json.file});
}


