import { SlashCommandBuilder } from "discord.js";
import Server from '../Database/Models/server.js';
import { EmbedBuilder } from "@discordjs/builders";


export const data = new SlashCommandBuilder()
    .setName('unrole')
    .setDescription('Remove a role from a user')
    .addUserOption(option => option.setName('user').setDescription('The user to remove the role from').setRequired(true))
    .addRoleOption(option => option.setName('role').setDescription('The role to remove from the user').setRequired(true));


export async function execute(interaction) {
const user = interaction.options.getUser('user');
const role = interaction.options.getRole('role');
const member = interaction.guild.members.cache.get(user.id);
const logChannel = await Server.findOne({id: interaction.guild.id});
const log = interaction.guild.channels.cache.get(logChannel.logChannel);


if(!interaction.member.permissions.has('MANAGE_ROLES')) return interaction.reply({content: 'You do not have permission to remove roles', ephemeral: true});
if(!interaction.guild.me.permissions.has('MANAGE_ROLES')) return interaction.reply({content: 'I do not have permission to remove roles', ephemeral: true});
if(member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({content: 'You cannot remove roles to this member', ephemeral: true});

await member.roles.remove(role);
const embed = new EmbedBuilder()
    .setTitle(`Removed ${role.name} from ${user.tag}`)
    .setColor(0x00AE86)
    .setTimestamp()
    .setFooter({
        text: `Command Requested by: ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL()
    });
interaction.reply({embeds: [embed]});
if(log) {
    log.send({embeds: [embed]});
}
}
