const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('@discordjs/builders');
const User = require('../Database/Models/user.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Check the leaderboard'),
    async execute(interaction) {
        const users = await User.find({ guildID: interaction.guild.id }).sort([['level', 'descending']]);
        let leaderboard = '';
        let i = 0;
        for (const user of users) {
            i++;
            const member = await interaction.guild.members.fetch(user.userID);
            leaderboard += `${i}. ${member.user.username}#${member.user.discriminator} - Level ${user.level} \n`;
        }
        const embed = new EmbedBuilder()
            .setTitle('Leaderboard')
            .setDescription(leaderboard)
            .setColor(0x00AE86)
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
        interaction.reply({embeds: [embed]});
        
    }
}

