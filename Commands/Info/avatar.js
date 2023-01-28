import { SlashCommandBuilder } from "discord.js";
import { EmbedBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Get the avatar of a user')
    .addUserOption(option => option.setName('user').setDescription('The user to get the avatar of').setRequired(false));

export async function execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const embed = new EmbedBuilder()
        .setTitle(`${user.tag}'s avatar`)
        .setImage(user.displayAvatarURL({dynamic: true, size: 512}))
        .setColor(0x00AE86)
        .setTimestamp()
        .setFooter({
            text: `Command Requested by: ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL()
        });
    interaction.reply({embeds: [embed]});
}