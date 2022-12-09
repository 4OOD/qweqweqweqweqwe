const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("pause").setDescription("Müziği duraklatır"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("Sırada hiç şarkı yok")

		queue.setPaused(true)
        await interaction.editReply("Müzik duraklatıldı! Müziği devam ettirmek için `/resume` tuşunu kullanın")
	},
}