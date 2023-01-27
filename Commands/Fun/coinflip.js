import { SlashCommandBuilder } from "discord.js";
import fetch from 'node-fetch';

export const data = new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Flip a coin');


export async function execute(interaction) {
  const response = await fetch('https://www.random.org/integers/?num=1&min=0&max=1&col=1&base=10&format=plain&rnd=new');
    const json = await response.text();
    if (json == 0) {
        interaction.reply({content: 'Heads'});
        }
    else {
        interaction.reply({content: 'Tails'});
        }
        
}

