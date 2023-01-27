import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout a user')
    .addUserOption(option => option.setName('user').setDescription('The user to timeout').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('The reason for the timeout').setRequired(false));

export async function execute(interaction) {

    const user = interaction.options.getUser('user');
    const duration = interaction.options.getInteger('duration (in minutes)');
    const reason = interaction.options.getString('reason');

    if(!interaction.member.permissions.has('BAN_MEMBERS')) return interaction.reply({content: 'You do not have permission to ban members', ephemeral: true});
    if(!interaction.guild.me.permissions.has('BAN_MEMBERS')) return interaction.reply({content: 'I do not have permission to ban members', ephemeral: true});

    const member = interaction.guild.members.cache.get(user.id);
    if(member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({content: 'You cannot ban this member', ephemeral: true});

    await member.timeout(duration * 60 * 1000, {reason: reason});
    interaction.reply({content: `Timeout for ${user.tag} ${reason ? `for ${reason}` : ''} for ${duration} minutes`});


}