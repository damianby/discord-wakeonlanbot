const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

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


		const embed = new EmbedBuilder()
			.setTimestamp();

		const result = wolManager.removePc(interaction.user.id, interaction.options.getString('friendly_name'));
		if(result.error) {
			embed.setTitle(`${result.error}`);
			embed.setColor(0xff0000);
			await interaction.reply({ embeds: [embed], ephemeral: true});
		} else {
			embed.setColor(0x00FF00);
			embed.setTitle(`PC ${interaction.options.getString('friendly_name')} succesfully removed`);
			await interaction.reply({ embeds: [embed], ephemeral: true});
		}
	},
	async autocomplete(interaction) {
		const pcs = wolManager.getPcs(interaction.user.id);

		const names = pcs.map(a => ({ name: a.friendlyName, value: a.friendlyName }));

		await interaction.respond(names);
	}
};