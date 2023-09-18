const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wakemypc')
		.setDescription('Wake your pc!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};