const { SlashCommandBuilder } = require("@discordjs/builders")
const MessageEmbed = require("discord.js")
const Discord = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("loads songs from youtube")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("song")
				.setDescription("Bir url'den tek bir şarkı yükler")
				.addStringOption((option) => option.setName("url").setDescription("the song's url").setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("playlist")
				.setDescription("Bir url'den şarkılardan oluşan bir çalma listesi yükler")
				.addStringOption((option) => option.setName("url").setDescription("the playlist's url").setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("search")
				.setDescription("Sağlanan anahtar kelimelere göre şarkı arar")
				.addStringOption((option) =>
					option.setName("searchterms").setDescription("the search keywords").setRequired(true)
				)
		),
	run: async ({ client, interaction }) => {
		if (!interaction.member.voice.channel) return interaction.editReply("Bu komutu kullanmak için Sesli Sohbette olmanız gerekir.")

		const queue = await client.player.createQueue(interaction.guild)
		if (!queue.connection) await queue.connect(interaction.member.voice.channel)

          
		if (interaction.options.getSubcommand() === "song") {
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })
            if (result.tracks.length === 0)
                return interaction.editReply("Sonuç yok")
            
            const song = result.tracks[0]
            await queue.addTrack(song)

		} else if (interaction.options.getSubcommand() === "playlist") {
            let url = interaction.options.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            })

            if (result.tracks.length === 0)
                return interaction.editReply("Sonuç yok")
            
            const playlist = result.playlist
            await queue.addTracks(result.tracks)
		} else if (interaction.options.getSubcommand() === "search") {
            let url = interaction.options.getString("searchterms")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            if (result.tracks.length === 0)
                return interaction.editReply("Sonuç yok")
            
            const song = result.tracks[0]
            await queue.addTrack(song)
		}
        if (!queue.playing) await queue.play()
	},
}