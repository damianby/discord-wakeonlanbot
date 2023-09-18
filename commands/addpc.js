const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addpc')
		.setDescription('Wake your pc!')
		.addStringOption(option =>
			option.setName('mac_address')
				.setDescription('Mac address of your PC')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('network_name')
				.setDescription('Name of the network you wish to join')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('ip_address')
				.setDescription('IP address of your pc to test if it\'s online')
				.setRequired(false)),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};