import { SlashCommandBuilder } from "discord.js";
import Server from '../Database/Models/server.js';
import { EmbedBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
    .setName('setwelcome')
    .setDescription('Set the welcome channel')
    .addChannelOption(option => option.setName('channel').setDescription('The channel to set as the welcome channel').setRequired(true));

export async function execute(interaction) {
const channel = interaction.options.getChannel('channel');
const guild = interaction.guild;
const embed = new EmbedBuilder()
    .setTitle('Set Welcome Channel')
    .setDescription(`Set the welcome channel to ${channel}`)
    .setColor(0x00AE86)
    .setTimestamp()
    .setFooter({
        text: `Command Requested by: ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL()
    });

    const server = await Server.findOne({id: guild.id});
if(!server) {
    const newServer = new Server({
        welcomeChannel: channel.id,
        guildID: guild.id
    });
    await newServer.save();
}
else {
    server.welcomeChannel = channel.id;
    await server.save();
}

interaction.reply({embeds: [embed]});
}


