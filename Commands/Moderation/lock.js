import { SlashCommandBuilder, GatewayIntentBits } from "discord.js";
import { EmbedBuilder } from "@discordjs/builders";
import  Permissions  from "discord.js";
import { PermissionsBitField } from "discord.js";
import Server from "../Database/Models/server.js"


export const data = new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Lock a channel');

export async function execute(interaction) {
    const channel = interaction.channel;
    const logChannel = await Server.findOne({id: interaction.guild.id});
    const log = interaction.guild.channels.cache.get(logChannel.logChannel);

    //check if user has permission to lock the channel
    if (!interaction.member.permissions.has('MANAGE_CHANNELS')) {
        return interaction.reply({ content: 'You do not have permission to lock this channel', ephemeral: true });
    }
    
    channel.permissionOverwrites.set([
        {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.SendMessages],
        }, {
          id: interaction.guild.id,
          allow: [PermissionsBitField.Flags.ViewChannel],
        }, {
          id: interaction.guild.id,
          allow: [PermissionsBitField.Flags.ReadMessageHistory]
        }, {
           id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.CreatePublicThreads]
        }, {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.CreatePrivateThreads]
        }
      ]);
    


    const embed = new EmbedBuilder()
        .setTitle('Lock')
        .setDescription(`Locked channel ${channel}`)
        .setColor(0x00AE86)
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp();

//send embed to log channel
if(log){
    await log.send({ embeds: [embed] });
}

await interaction.reply({ embeds: [embed] });
//delete reply after 5 seconds
    setTimeout(() => {
        interaction.deleteReply();
    }
    , 500);




}