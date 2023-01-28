const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Send an invite link for the server to the user')
        .addStringOption(option => option.setName('user').setDescription('user id that you want to invite').setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getString('user');
        const invite = await interaction.channel.createInvite({maxAge: 0, maxUses: 0});
        if(!user){
            interaction.reply({content: `Invite link: ${invite}`, ephemeral: true});
        } else {

            const embed = new EmbedBuilder()
                .setTitle(`Invite to ${interaction.guild.name}`)
                .setDescription(`You have been invited! Click [here](${invite}) to join the server!`)
                .setThumbnail(interaction.guild.iconURL())
                .setColor(0x00AE86)
                .setTimestamp()
                .setFooter({
                    text: `Invited by: ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL()
                });

                //get the username based on the id
            const dmChannel = await interaction.client.users.fetch(user);

            await dmChannel.send({embeds: [embed]})
            //if user doesnt have dms open, it will send an error
            .catch(() => interaction.reply({content: `User has dms closed`, ephemeral: true}));

            interaction.reply({content: `Invite link sent`, ephemeral: true});
        }
    },
};
