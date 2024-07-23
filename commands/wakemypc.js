const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

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

		const pcs = wolManager.getPcs(interaction.user.id);

		let clientPc = null;
	
		if(!friendlyName || friendlyName.length == 0) {
			if(pcs.length > 0) {
				clientPc = pcs[0];
			}
		} else {
			for(let i = 0 ; i < pcs.length ; i++) {
				if(pcs[i].friendlyName == friendlyName) {
					clientPc = pcs[i];
					break;
				}
			}
		}

		const embed = new EmbedBuilder()
		.setColor(0xFF0000)
		.setTitle('PC Startup')
		.setTimestamp();


		await interaction.reply( {embeds: [embed], ephemeral: true });

		if(clientPc) {

			embed.setDescription(`Magic packet sent to ${friendlyName} with MAC address ${clientPc.mac}.\nWaiting for response from address ${clientPc.ipAddress}!`);

			wolManager.wakePc(clientPc.mac, clientPc.ipAddress).then( (isAlive) => {
				if(isAlive) {
	
					embed.setDescription('Your PC is online!');
					embed.setColor(0x00FF00);
	
					interaction.editReply({ embeds: [embed], ephemeral: true });
				} else {
					embed.setDescription(`After ${timeout} your PC is still dead`);
					interaction.editReply({ embeds: [embed], ephemeral: true });
				}
			});
		} else {
			embed.setDescription("PC not found");
		}

	},
	async autocomplete(interaction) {
		const pcs = wolManager.getPcs(interaction.user.id);

		const names = pcs.map(a => ({ name: a.friendlyName, value: a.friendlyName }));

		await interaction.respond(names);
	}
};