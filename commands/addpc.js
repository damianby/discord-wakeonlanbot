const { SlashCommandBuilder } = require('discord.js');

const wolManager = require('../wolmanager');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addpc')
		.setDescription('Add pc to your list')
		.addStringOption(option => 
			option.setName('friendly_name')
				.setDescription('Friendly name')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('mac_address')
				.setDescription('Mac address of your PC')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('ip_address')
				.setDescription('IP address of your pc to test if it\'s online')
				.setRequired(false)),
	async execute(interaction) {

		const friendlyName = interaction.options.getString('friendly_name');
		const macAddress = interaction.options.getString('mac_address');
		const ipAddress = interaction.options.getString('ip_address') ?? null;

		const result = wolManager.addPc(interaction.user.id, friendlyName, macAddress, ipAddress);


		if(result.error) {
			await interaction.reply({content: result.error, ephemeral: true});
		} else {

			await interaction.reply({ content: 'Your PC was succesfully saved!\nYou can now use /wakemypc to send magic packet!', ephemeral: true});
		}
	},
};