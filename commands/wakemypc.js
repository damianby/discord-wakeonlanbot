const { SlashCommandBuilder } = require('discord.js');

const wolManager = require('../wolmanager');

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

		wolManager.wakePc(interaction.user.id, friendlyName, (isAlive, timeout) => {
			if(isAlive) {
				interaction.followUp({ content: `Your PC is online!`, ephemeral: true });
			} else {
				interaction.followUp({ content: `After ${timeout} your PC is still dead`, ephemeral: true });
			}
		});

		await interaction.reply({ content: 'Magic packet sent! Waiting for PC to come online!', ephemeral: true });

	},
	async autocomplete(interaction) {
		const pcs = wolManager.getPcs(interaction.user.id);

		const names = pcs.map(a => ({ name: a.friendlyName, value: a.friendlyName }));

		await interaction.respond(names);
	}
};