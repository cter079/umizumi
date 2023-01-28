import { SlashCommandBuilder } from "discord.js";
import Server from '../Database/Models/server.js';
import { EmbedBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
    .setName('setlog')
    .setDescription('Set the log channel')
    .addChannelOption(option => option.setName('channel').setDescription('The channel to set as the log channel').setRequired(true));

export async function execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const guild = interaction.guild;
    const embed = new EmbedBuilder()
        .setTitle('Set Log Channel')
        .setDescription(`Set the log channel to ${channel}`)
        .setColor(0x00AE86)
        .setTimestamp()
        .setFooter({
            text: `Command Requested by: ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL()
        });

        const server = await Server.findOne({id: guild.id});
    if(!server) {
        const newServer = new Server({
            logChannel: channel.id,
            guildID: guild.id
        });
        await newServer.save();
    } else {
        server.logChannel = channel.id;
        await server.save();
    }

    interaction.reply({embeds: [embed]});

    

}
