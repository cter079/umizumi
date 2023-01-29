const {SlashCommandBuilder} = require('@discordjs/builders');
const {EmbedBuilder} = require('discord.js');
const {Permissions, PermissionsBitField} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reactrole')
        .setDescription('Create a reaction role message')
        .addStringOption(option => option.setName('message').setDescription('The message to send').setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription('The role to give').setRequired(true))
        .addStringOption(option => option.setName('emoji').setDescription('The emoji to react with').setRequired(true))
        .addChannelOption(option => option.setName('channel').setDescription('The channel to send the message in').setRequired(true)),

    async execute(interaction) {


        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) return interaction.reply({content: `You do not have permission to use this command`, ephemeral: true});
        const message = interaction.options.getString('message');
        const role = interaction.options.getRole('role');
        const emoji = interaction.options.getString('emoji');
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
        await msg.react(emoji);
        const filter = (reaction, user) => {
            return reaction.emoji.name === emoji && user.id === interaction.user.id;
        }
        const collector = msg.createReactionCollector({filter, time: 15000});
        collector.on('collect', (reaction, user) => {
            reaction.message.guild.members.cache.get(user.id).roles.add(role);
        }
        );

        



    }

};



