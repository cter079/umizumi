import { EmbedBuilder } from "@discordjs/builders";
import { SlashCommandBuilder } from "discord.js";


export const data = new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Create a poll')
    .addStringOption(option => option.setName('question').setDescription('The question to ask').setRequired(true))
    .addStringOption(option => option.setName('option1').setDescription('The first option').setRequired(true))
    .addStringOption(option => option.setName('option2').setDescription('The second option').setRequired(true))
   

export async function execute(interaction) {
    const question = interaction.options.getString('question');
    const option1 = interaction.options.getString('option1');
    const option2 = interaction.options.getString('option2');
    const embed = new EmbedBuilder()
        .setTitle(question)
        .setDescription(`1️⃣ ${option1} \n 2️⃣ ${option2}`)
        .setColor(0x00AE86)
        .setTimestamp()
        .setFooter({
            text: `Command Requested by: ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL(),
          });
    const msg = await interaction.reply({ embeds: [embed] });

    
    await msg.react('1️⃣');   
    await msg.react('2️⃣');



}

