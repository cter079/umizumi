const {SlashCommandBuilder} = require('@discordjs/builders');
const {EmbedBuilder} = require('discord.js');
const {Permissions, PermissionsBitField} = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('reactroles8')
        .setDescription('Create a reaction role message')
        //allow for multiple roles
        .addStringOption(option => option.setName('message').setDescription('The message to send').setRequired(true))
        .addRoleOption(option => option.setName('role1').setDescription('The role to give').setRequired(true))
        .addStringOption(option => option.setName('emoji1').setDescription('The emoji to react with').setRequired(true))
        .addRoleOption(option => option.setName('role2').setDescription('The role to give').setRequired(true))
        .addStringOption(option => option.setName('emoji2').setDescription('The emoji to react with').setRequired(true))
        .addRoleOption(option => option.setName('role3').setDescription('The role to give').setRequired(true))
        .addStringOption(option => option.setName('emoji3').setDescription('The emoji to react with').setRequired(true))
        .addRoleOption(option => option.setName('role4').setDescription('The role to give').setRequired(true))
        .addStringOption(option => option.setName('emoji4').setDescription('The emoji to react with').setRequired(true))
        .addRoleOption(option => option.setName('role5').setDescription('The role to give').setRequired(true))
        .addStringOption(option => option.setName('emoji5').setDescription('The emoji to react with').setRequired(true))
        .addRoleOption(option => option.setName('role6').setDescription('The role to give').setRequired(true))
        .addStringOption(option => option.setName('emoji6').setDescription('The emoji to react with').setRequired(true))
        .addRoleOption(option => option.setName('role7').setDescription('The role to give').setRequired(true))
        .addStringOption(option => option.setName('emoji7').setDescription('The emoji to react with').setRequired(true))
        .addRoleOption(option => option.setName('role8').setDescription('The role to give').setRequired(true))
        .addStringOption(option => option.setName('emoji8').setDescription('The emoji to react with').setRequired(true))

        .addChannelOption(option => option.setName('channel').setDescription('The channel to send the message in').setRequired(true)),
    async execute(interaction) {
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) return interaction.reply({content: `You do not have permission to use this command`, ephemeral: true});

        const message = interaction.options.getString('message');
        const role1 = interaction.options.getRole('role1');
        const emoji1 = interaction.options.getString('emoji1');
        const role2 = interaction.options.getRole('role2');
        const emoji2 = interaction.options.getString('emoji2');
        const role3 = interaction.options.getRole('role3');
        const emoji3 = interaction.options.getString('emoji3');
        const role4 = interaction.options.getRole('role4');
        const emoji4 = interaction.options.getString('emoji4');
        const role5 = interaction.options.getRole('role5');
        const emoji5 = interaction.options.getString('emoji5');
        const role6 = interaction.options.getRole('role6');
        const emoji6 = interaction.options.getString('emoji6');
        const role7 = interaction.options.getRole('role7');
        const emoji7 = interaction.options.getString('emoji7');
        const role8 = interaction.options.getRole('role8');
        const emoji8 = interaction.options.getString('emoji8');
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
        await msg.react(emoji3);
        await msg.react(emoji4);
        await msg.react(emoji5);
        await msg.react(emoji6);
        await msg.react(emoji7);
        await msg.react(emoji8);
        interaction.reply({content: `Message sent to ${channel}`, ephemeral: true});

        const filter = (reaction, user) => {
            return [emoji1, emoji2, emoji3, emoji4, emoji5, emoji6, emoji7, emoji8].includes(reaction.emoji.name) && !user.bot;
        }

        const collector = msg.createReactionCollector({filter, time: 60000});

        collector.on('collect', (reaction, user) => {
            const member = interaction.guild.members.cache.get(user.id);
            if (reaction.emoji.name === emoji1) {
                member.roles.add(role1);
            } else if (reaction.emoji.name === emoji2) {
                member.roles.add(role2);
            } else if (reaction.emoji.name === emoji3) {
                member.roles.add(role3);
            } else if (reaction.emoji.name === emoji4) {
                member.roles.add(role4);
            } else if (reaction.emoji.name === emoji5) {
                member.roles.add(role5);
            } else if (reaction.emoji.name === emoji6) {
                member.roles.add(role6);
            } else if (reaction.emoji.name === emoji7) {
                member.roles.add(role7);
            } else if (reaction.emoji.name === emoji8) {
                member.roles.add(role8);
            }
        }
        );

    },
};




