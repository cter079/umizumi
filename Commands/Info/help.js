import { SlashCommandBuilder } from "discord.js";
import { EmbedBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get all the commands');

export async function execute(interaction) {

    const embed = new EmbedBuilder()
        .setTitle('Help')
        .setDescription('Get all the commands')
        .setColor(0x00AE86)
        .addFields(
            {name: 'Moderator', value: 'Ban, kick, timeout, warn, (un)lock, addrole, unrole', inline: true},
            {name: 'Info', value: 'Help, serverinfo, userinfo, xp, avatar', inline: true},
            {name: 'Fun', value: 'gif, cat, coinflip, urban, poll', inline: true},

        
        )
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp();


    await interaction.reply({ embeds: [embed] });

}


