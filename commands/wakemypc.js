const { SlashCommandBuilder } = require('discord.js');

const wolManager = require('../wolmanager');

const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wakemypc')
		.setDescription('Wake your pc!')
		.addStringOption(option => 
			option.setName('friendly_name')
				.setDescription('Friendly name, if omitted start first one')
				.setRequired(false)
				.setAutocomplete(true)),
	async execute(interaction) {

		const friendlyName = interaction.options.getString('friendly_name');

		const embed = new EmbedBuilder()
		.setColor(0xFF0000)
		.setTitle('PC Startup')
		.setTimestamp();
		
		const result = wolManager.wakePc(interaction.user.id, friendlyName, (isAlive, timeout) => {
			if(isAlive) {

				embed.setDescription('Your PC is online!');
				embed.setFooter({ text: '\u200B', iconURL: 'https://i.imgur.com/AfFp7pu.png'});

				embed.setColor(0x00FF00);

				interaction.editReply({ embeds: [embed], ephemeral: true });
			} else {
				embed.setDescription(`After ${timeout} your PC is still dead`);
				interaction.editReply({ embeds: [embed], ephemeral: true });
			}
		});

		if(result.client) {
			embed.setDescription(`Magic packet sent to ${result.client.friendlyName} with MAC address ${result.client.mac}.\nWaiting for response from address ${result.client.ipAddress}!`);
			embed.setFooter({ text: 'This message will be automatically edited when PC is found online', iconURL: 'https://i.imgur.com/AfFp7pu.png'});

		} else {
			embed.setDescription(result.error);
		}

		await interaction.reply( {embeds: [embed], ephemeral: true });

	},
	async autocomplete(interaction) {
		const pcs = wolManager.getPcs(interaction.user.id);

		const names = pcs.map(a => ({ name: a.friendlyName, value: a.friendlyName }));

		await interaction.respond(names);
	}
};