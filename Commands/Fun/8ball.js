import { SlashCommandBuilder } from "discord.js";
import { EmbedBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Ask the magic 8ball a question')
    .addStringOption(option => option.setName('question').setDescription('The question to ask').setRequired(true));

export async function execute(interaction) {
    const question = interaction.options.getString('question');
    const responses = [
        'It is certain.',
        'It is decidedly so.',
        'Without a doubt.',
        'Yes - definitely.',
        'No.',
        'My sources say no.',
        'In the future.',
        'Outlook not so good.',
        'Very doubtful.',
        'Signs point to yes.',
        'Yes.',
        'Reply hazy, try again.',
        'Ask again later.',
        'Better not tell you now.',

    ]
    const random = Math.floor(Math.random() * responses.length);
    const embed = new EmbedBuilder()
        .setTitle('🎱Magic 8ball says...') 
        .setDescription(`**Question:** ${question}\n**Answer:** ${responses[random]}`)
        .setColor(0x00AE86)
        .setTimestamp()
        .setFooter({
            text: `Command Requested by: ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL(),
          });
    interaction.reply({ embeds: [embed] });
}

  
