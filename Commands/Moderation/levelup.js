import { SlashCommandBuilder } from "discord.js";
import { EmbedBuilder } from "@discordjs/builders";
import Server from '../Database/Models/server.js';

export const data = new SlashCommandBuilder()
    .setName('setcommandchannel')
    .setDescription('Set the command channel')
    .addChannelOption(option => option.setName('channel').setDescription('The channel to set as the command channel').setRequired(true));

export async function execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const guild = interaction.guild;
    const embed = new EmbedBuilder()
        .setTitle('Set Command Channel')
        .setDescription(`Set the command channel to ${channel}`)
        .setColor(0x00AE86)
        .setTimestamp()
        .setFooter({
            text: `Command Requested by: ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL()
        });

        const server = await Server.findOne({id: guild.id});
    if(!server) {
        const newServer = new Server({
            levelUp: channel.id,
            guildID: guild.id
        });
        await newServer.save();
    }
    else {
        server.levelUp = channel.id;
        await server.save();
    }

    interaction.reply({embeds: [embed]});
}

