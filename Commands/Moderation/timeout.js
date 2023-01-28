import { SlashCommandBuilder } from "discord.js";
import { EmbedBuilder } from "@discordjs/builders";
import Server from '../Database/Models/server.js';
import { set } from "mongoose";

export const data = new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout a user')
    .addUserOption(option => option.setName('user').setDescription('The user to timeout').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('The reason for the timeout').setRequired(false));

export async function execute(interaction) {

    const user = interaction.options.getUser('user');
    const duration = interaction.options.getInteger('duration (in minutes)');
    const reason = interaction.options.getString('reason');
    const logChannel = interaction.guild.channels.cache.get(server.logChannel);
    const log = interaction.guild.channels.cache.get(logChannel.logChannel);

    if(!interaction.member.permissions.has('BAN_MEMBERS')) return interaction.reply({content: 'You do not have permission to ban members', ephemeral: true});
    if(!interaction.guild.me.permissions.has('BAN_MEMBERS')) return interaction.reply({content: 'I do not have permission to ban members', ephemeral: true});

    const member = interaction.guild.members.cache.get(user.id);
    if(member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({content: 'You cannot ban this member', ephemeral: true});

    await member.timeout(duration * 60 * 1000, {reason: reason});
    const embed = new EmbedBuilder()
        .setTitle(`Timeout ${user.tag}`)
        .setDescription(`${reason ? `for ${reason}` : ''}`)
        .setColor(0x00AE86)
        .setTimestamp()
        .setFooter({
            text: `Command Requested by: ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL()
        });

    if(log){
        log.send({embeds: [embed]});
    }

    interaction.reply({embeds: [embed]})
    setTimeout(() => {
        reply.delete();
    }, 500);
    


}