const {SlashCommandBuilder} = require('@discordjs/builders');
const {EmbedBuilder} = require('discord.js');
const User = require('../Database/Models/user.js');
const {Permissions, PermissionsBitField} = require('discord.js');
const { ActionRowBuilder } = require('discord.js');
const { ButtonBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Create a ticket embed with reply emoji to open a ticket')
        .addStringOption(option => option.setName('message').setDescription('ticket message').setRequired(true))
        .addChannelOption(option => option.setName('channel').setDescription('channel to send the ticket embed').setRequired(true))
        .addStringOption(option => option.setName('emoji').setDescription('reaction emoji to open ticket').setRequired(true)),


    async execute(interaction) {
        const message = interaction.options.getString('message');
        const channel = interaction.options.getChannel('channel');
        const emoji = interaction.options.getString('emoji');
        const embed = new EmbedBuilder()
            .setTitle(message)
            .setColor(0x00AE86)
            .setTimestamp()
            
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('ticket')
                    .setLabel('Open Ticket')
                    .setStyle(1)
                    .setEmoji(emoji)
            );
        const msg = await channel.send({embeds: [embed], components: [row]});
        const filter = (interaction) => {
            return interaction.customId === 'ticket' && interaction.user.id === interaction.user.id;
        }
        const collector = msg.createMessageComponentCollector({filter, time: 15000});
        collector.on('collect', async (interaction) => {
            const guild = interaction.guild;
            //find the category to put the ticket in discord v14
            

            //find the everyone role
            const everyoneRole = guild.roles.everyone;
            const category = guild.channels.cache.find(c => c.name == "Tickets" && c.type == "GUILD_CATEGORY");




            const channel = await guild.channels.create({
                name: `ticket-${interaction.user.username}`,
                type: 0,
                parent: process.env.TICKETS_ID,
            });

            //set permissions for the channel
           await channel.permissionOverwrites.set([
                {
                  id: everyoneRole.id,
                  deny: [PermissionsBitField.Flags.ViewChannel],
              
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                },

              ])
        

            //send a message to the channel
            const embed = new EmbedBuilder()
                .setTitle(`Ticket for ${interaction.user.username}`)
                .setColor(0x00AE86) 
                .setTimestamp()
                .setFooter({
                    text: `Ticket created by: ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL(),
                });
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('close')
                        .setLabel('Close Ticket')
                        .setStyle(4)
                );
            const msg = await channel.send({embeds: [embed], components: [row]});
            const filter = (interaction) => {
                return interaction.customId === 'close' && interaction.user.id === interaction.user.id;
            }
            const collector = msg.createMessageComponentCollector({filter, time: 15000});
            collector.on('collect', async (interaction) => {
                await channel.delete();
            }

            )
        })





    }
};


