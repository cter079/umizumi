const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Get info on the server'),
    async execute(interaction) {
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
                { name: 'Boost Count', value: `${interaction.guild.premiumSubscriptionCount}` },
                { name: 'Boost Level', value: `${interaction.guild.premiumTier}` },
                { name: 'Server Created', value: `${interaction.guild.createdAt}` },
                { name: 'Server ID', value: `${interaction.guild.id}` },

            )
            .setColor('#0099ff')
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();


        await interaction.reply({ embeds: [embed] });
    },
};




