import { SlashCommandBuilder } from "discord.js";
import fetch from 'node-fetch';
import { EmbedBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
    .setName('urban')
    .setDescription('Search for a definition on Urban Dictionary')
    .addStringOption(option => option.setName('query').setDescription('The query to search for').setRequired(true));

export async function execute(interaction) {
    const query = interaction.options.getString('query');
    const response = await fetch(`https://api.urbandictionary.com/v0/define?term=${query}`);
    const json = await response.json();

    if(!json.list.length) return interaction.reply({content: 'No results found', ephemeral: true});

    const [answer] = json.list;

    const embed = new EmbedBuilder()
        .setTitle(answer.word)
        .setURL(answer.permalink)
        .setColor(0x00AE86)
        .setDescription(answer.definition)
        .addFields(
            {name: 'Example', value: answer.example},
            {name: 'Rating', value: `${answer.thumbs_up} thumbs up. ${answer.thumbs_down} thumbs down.`}
        )
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp();

    interaction.reply({embeds: [embed]});
 
}
