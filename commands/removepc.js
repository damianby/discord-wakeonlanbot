const { SlashCommandBuilder } = require('discord.js');

const wolManager = require('../wolmanager');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removepc')
		.setDescription('Remove PC from the list')
		.addStringOption(option => 
			option.setName('friendly_name')
				.setDescription('Friendly name')
				.setRequired(true)
				.setAutocomplete(true)),
	async execute(interaction) {

		const result = wolManager.removePc(interaction.user.id, interaction.options.getString('friendly_name'));
		if(result.error) {
			await interaction.reply({ content: result.error, ephemeral: true});
		} else {
			await interaction.reply({ content: 'PC succesfully removed', ephemeral: true});
		}
	},
	async autocomplete(interaction) {
		const pcs = wolManager.getPcs(interaction.user.id);

		const names = pcs.map(a => ({ name: a.friendlyName, value: a.friendlyName }));

		await interaction.respond(names);
	}
};