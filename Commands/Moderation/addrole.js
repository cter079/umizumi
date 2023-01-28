import { SlashCommandBuilder } from "discord.js";
import { EmbedBuilder } from "@discordjs/builders";
import Server from '../Database/Models/server.js';

export const data = new SlashCommandBuilder()
    .setName('addrole')
    .setDescription('Add a role to a user')
    .addUserOption(option => option.setName('user').setDescription('The user to add the role to').setRequired(true))
    .addRoleOption(option => option.setName('role').setDescription('The role to add to the user').setRequired(true));

export async function execute(interaction) {
    const user = interaction.options.getUser('user');
    const role = interaction.options.getRole('role');
    const logChannel = await Server.findOne({id: interaction.guild.id});
    const log = interaction.guild.channels.cache.get(logChannel.logChannel);


    if(!interaction.member.permissions.has('MANAGE_ROLES')) return interaction.reply({content: 'You do not have permission to add roles', ephemeral: true});
    if(!interaction.guild.me.permissions.has('MANAGE_ROLES')) return interaction.reply({content: 'I do not have permission to add roles', ephemeral: true});

    const member = interaction.guild.members.cache.get(user.id);
    if(member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({content: 'You cannot add roles to this member', ephemeral: true});

    await member.roles.add(role);
    const embed = new EmbedBuilder()
        .setTitle(`Added ${role.name} to ${user.tag}`)
        .setColor(0x00AE86)
        .setTimestamp()
        .setFooter({
            text: `Command Requested by: ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL()
        });
    interaction.reply({embeds: [embed]});
    setTimeout(() => {
        interaction.deleteReply();
    }, 500);

    if(log) {
        log.send({embeds: [embed]});
    }

}
