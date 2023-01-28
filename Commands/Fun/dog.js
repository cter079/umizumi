import { SlashCommandBuilder } from "discord.js";
import fetch from 'node-fetch';
import { EmbedBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
    .setName('dog')
    .setDescription('Get a random dog image/gif');

export async function execute(interaction) {
    const response = await fetch('https://random.dog/woof.json');
    const json = await response.json();
    const embed = new EmbedBuilder()
        .setTitle('Dog')
        .setImage(json.url)
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp();
    interaction.reply({ embeds: [embed] });
}