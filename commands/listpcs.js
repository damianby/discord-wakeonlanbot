const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const wolManager = require('../wolmanager');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('listpcs')
		.setDescription('List all your pc\'s'),
	async execute(interaction) {

		const result = wolManager.getPcs(interaction.user.id);

		const embed = new EmbedBuilder()

			.setTitle('List of PC\'s')
			.setTimestamp();

		if(result.length > 0) {


			for(let i = 0; i < result.length; i++) {
				embed.addFields(
					{ name: result[i].friendlyName, value: `${result[i].mac}\n${result[i].ipAddress}` },
				)
			}
			
			embed.setColor(0x00ff00);

			await interaction.reply({ embeds: [embed], ephemeral: true});
		} else {

			embed.setColor(0xff0000);

			await interaction.reply({ embeds: [embed], ephemeral: true});
		}
	},
};