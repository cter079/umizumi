import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user')
    .addUserOption(option => option.setName('user').setDescription('The user to ban').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('The reason for the ban').setRequired(false));

export async function execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');

    if(!interaction.member.permissions.has('BAN_MEMBERS')) return interaction.reply({content: 'You do not have permission to ban members', ephemeral: true});
    if(!interaction.guild.me.permissions.has('BAN_MEMBERS')) return interaction.reply({content: 'I do not have permission to ban members', ephemeral: true});

    const member = interaction.guild.members.cache.get(user.id);
    if(member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({content: 'You cannot ban this member', ephemeral: true});

    await member.ban({reason: reason});
    interaction.reply({content: `Banned ${user.tag} ${reason ? `for ${reason}` : ''}`});
}
