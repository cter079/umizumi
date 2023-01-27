
import { SlashCommandBuilder } from '@discordjs/builders';
import { EmbedBuilder } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { config } from 'dotenv';
import { Client} from 'discord.js';
import fs from 'fs';





export const data = new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Get info on the server');

export async function execute(interaction) {
    const serverOwnerID = interaction.guild.ownerId 
    const serverOwner = await interaction.guild.members.fetch(serverOwnerID)


    const embed = new EmbedBuilder()
        .setTitle('Server Info')
        .setThumbnail(interaction.guild.iconURL())
        .setDescription('Get info on the server')
        .addFields(
            { name: 'Server Name', value: interaction.guild.name },
            { name: 'Total Members', value: `${interaction.guild.memberCount}` },
            { name: 'Server Owner', value: `${serverOwner.user.tag}` },      
            {name: 'Boost Count', value: `${interaction.guild.premiumSubscriptionCount}`},
            {name: 'Boost Level', value: `${interaction.guild.premiumTier}`},
            { name: 'Server Created', value: `${interaction.guild.createdAt}` },
            { name: 'Server ID', value: `${interaction.guild.id}` },

            
        )
        .setColor('#0099ff')
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })

        .setTimestamp();


    await interaction.reply({ embeds: [embed] });
}





