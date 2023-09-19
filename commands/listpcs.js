const { SlashCommandBuilder } = require('discord.js');

const wolManager = require('../wolmanager');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('listpcs')
		.setDescription('List all your pc\'s'),
	async execute(interaction) {

		const result = wolManager.getPcs(interaction.user.id);

		if(result.length > 0) {
			await interaction.reply({ content: JSON.stringify(result, null, '\t'), ephemeral: true});
		} else {
			await interaction.reply({ content: 'No PC\'s found!', ephemeral: true});
		}
	},
};