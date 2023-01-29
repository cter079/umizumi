const {SlashCommandBuilder} = require('@discordjs/builders');
const {EmbedBuilder} = require('discord.js');
const {Permissions, PermissionsBitField} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reactroles2')
        .setDescription('Create a reaction role message')
        //allow for multiple roles
        .addStringOption(option => option.setName('message').setDescription('The message to send').setRequired(true))
        .addRoleOption(option => option.setName('role1').setDescription('The role to give').setRequired(true))
        .addStringOption(option => option.setName('emoji1').setDescription('The emoji to react with').setRequired(true))
        .addRoleOption(option => option.setName('role2').setDescription('The role to give').setRequired(true))
        .addStringOption(option => option.setName('emoji2').setDescription('The emoji to react with').setRequired(true))

        .addChannelOption(option => option.setName('channel').setDescription('The channel to send the message in').setRequired(true)),

    async execute(interaction) {
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) return interaction.reply({content: `You do not have permission to use this command`, ephemeral: true});

        const message = interaction.options.getString('message');
        const role1 = interaction.options.getRole('role1');
        const emoji1 = interaction.options.getString('emoji1');
        const role2 = interaction.options.getRole('role2');
        const emoji2 = interaction.options.getString('emoji2');
        const channel = interaction.options.getChannel('channel');
        const embed = new EmbedBuilder()
            .setTitle(message)
            .setColor(0x00AE86)
            .setTimestamp()
            .setFooter({
                text: `Command Requested by: ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL(),
            });
        const msg = await channel.send({embeds: [embed]});
        await msg.react(emoji1);
        await msg.react(emoji2);

        interaction.reply({content: `Message sent to ${channel}`, ephemeral: true});

        const filter = (reaction, user) => {
            return (reaction.emoji.name === emoji1 || reaction.emoji.name === emoji2) && user.id === interaction.user.id;
        }
        const collector = msg.createReactionCollector({filter, time: 15000});
        collector.on('collect', (reaction, user) => {
            if (reaction.emoji.name === emoji1) {
                reaction.message.guild.members.cache.get(user.id).roles.add(role1);
            } else if (reaction.emoji.name === emoji2) {
                reaction.message.guild.members.cache.get(user.id).roles.add(role2);
            }
        }
        );

    }
};
