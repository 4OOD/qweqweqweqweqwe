const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("quit").setDescription("Botu durdurur ve kuyruğu temizler"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("Sırada hiç şarkı yok")

		queue.destroy()
        await interaction.editReply("Görüşürüz")
	},
}