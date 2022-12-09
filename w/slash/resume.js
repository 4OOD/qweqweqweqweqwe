const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("resume").setDescription("Müziği devam ettirir"),
	run: async ({ client, interaction }) => {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("There are no songs in the queue")

		queue.setPaused(false)
        await interaction.editReply("Müzik duraklatıldı! Müziği sürdürmek için `/pause` kullanın")
	},
}