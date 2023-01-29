const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('@discordjs/builders');
const User = require('../Database/Models/user.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('xp')
        .setDescription('Check your xp'),
    async execute(interaction) {
        const user = await User.findOne({ userID: interaction.user.id, guildID: interaction.guild.id });
if(!user){
    let newUser = await User.create({
        userID: interaction.user.id,
        guildID: interaction.guild.id,
        warns: 0,
        xp: 0,
        level: 0
    });
    newUser.save();

    const embed = new EmbedBuilder()
    .setTitle('XP')
    .setDescription('Check your xp and level. Need 500xp to level up') 
    .addFields(
        {name: 'Level', value: '0', inline: true},
        {name: 'XP', value: '0', inline: true}
    )



    return interaction.reply({embeds: [embed]});



} else {
    const embed = new EmbedBuilder()
    .setColor(0x00AE86)
    .setTitle(`${interaction.user.username}'s XP`)
    .setDescription('Check your xp')
    .setThumbnail(interaction.user.displayAvatarURL())
    .addFields(
        {name: 'Level', value: `${user.level}`, inline: true},
        {name: 'XP', value: `${user.xp}`, inline: true}
    )
    .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })

    return interaction.reply({embeds: [embed]});
}

}
};



