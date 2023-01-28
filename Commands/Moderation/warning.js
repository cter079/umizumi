import { SlashCommandBuilder } from "discord.js";
import { EmbedBuilder } from "@discordjs/builders";
import User from '../Database/Models/user.js';
import Server from '../Database/Models/server.js';





export const data = new SlashCommandBuilder()
    .setName('warning')
    .setDescription('Warn a user')
    .addUserOption(option => option.setName('user').setDescription('The user to warn').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('The reason for the warning').setRequired(false));


export async function execute(interaction) {

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const logChannel = await Server.findOne({id: interaction.guild.id});
    const log = interaction.guild.channels.cache.get(logChannel.logChannel);






    if(!interaction.member.permissions.has('BAN_MEMBERS')) return interaction.reply({content: 'You do not have permission to warn members', ephemeral: true});
    if(!interaction.guild.me.permissions.has('BAN_MEMBERS')) return interaction.reply({content: 'I do not have permission to warn members', ephemeral: true});

    const member = interaction.guild.members.cache.get(user.id);
    if(member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({content: 'You cannot warn this member', ephemeral: true});

    await member.warn({reason: reason});
    const embed = new EmbedBuilder()
        .setTitle(`Warned ${user.tag}`)
        .setDescription(`${reason ? `for ${reason}` : ''}`)
        .setColor(0x00AE86)
        .setTimestamp()
        .setFooter({
            text: `Command Requested by: ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL()
        });


    interaction.reply({content: `Warned ${user.tag}`, ephemeral: true});
    setTimeout(() => {
        interaction.deleteReply();
    }, 500);



    if(log){
    log.send({embeds: [embed]});
}



    const data = await User.findOne({ userID: user.id, guildID: interaction.guild.id });
    //if user is not in database add user to database
    if(!data){
        let newUser = await User.create({
            userID: user.id,
            guildID: interaction.guild.id,
            warns: 0,
            xp: 0,
            level: 1
        });
        newUser.save();
    } else {
        data.warns += 1;
        data.save();
    }
}


