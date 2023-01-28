import { SlashCommandBuilder } from "discord.js";
import { EmbedBuilder } from "discord.js";
import User from "../Database/Models/user.js";

export const data = new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Get info about a user')
    .addUserOption(option => option.setName('user').setDescription('The user to get info on').setRequired(false));

export async function execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const data = await User.findOne({ userID: user.id, guildID: interaction.guild.id });

    //get 
    const member = interaction.guild.members.cache.get(user.id);
    const roles = member.roles.cache.map(role => role.toString()).join(' ');
    const embed = new EmbedBuilder()
    .setTitle(`User info for ${user.tag}`)
    .setThumbnail(user.displayAvatarURL())
    .addFields(
        {name: 'User ID', value: user.id, inline: true},
        {name: 'Nickname', value: member.nickname || 'None', inline: true},
        {name: 'Joined Server', value: member.joinedAt.toDateString(), inline: true},
        {name: 'Joined Discord', value: user.createdAt.toDateString(), inline: true},
        {name: 'Level', value: `Level ${data.level}`, inline: true},
        {name: 'Roles', value: roles}

    )
    .setColor(member.displayHexColor)
    .setFooter({text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL()})
    .setTimestamp();
    interaction.reply({ embeds: [embed] });
}