const { MessageEmbed } = require("discord.js");
const User = require("../../AccountHandling/user.js");

module.exports = {
    commandInfo: {
        name: "AccountDetails",
        description: "Shows You Your Account Details"
    },
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const user = await User.findOne({ discordId: interaction.user.id }).lean();
        if (!user) return interaction.editReply({ content: "You do not have a registered account!", ephemeral: true });

        let onlineStatus = global.Clients.some(i => i.accountId == user.accountId);

        let embed = new MessageEmbed()
        .setColor("#56ff00")
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
        .setFields(
            { name: "Created", value: `${new Date(user.created)}`.substring(0, 15) },
            { name: "Online", value: `${onlineStatus ? "Yes" : "No"}` },
            { name: "Banned", value: `${user.banned ? "Yes" : "No"}` },
            { name: "Account ID", value: user.accountId },
            { name: 'Username', value: user.username },
            { name: 'Email', value: `||${user.email}||` },
            { name: 'Kills', value: `${user.statisticsKills}` },
            { name: 'Wins', value: `${user.statisticsWins}` },
            { name: 'Top 10', value: `${user.statisticsTop10}` },
            { name: 'Top 5', value: `${user.statisticsTop5}` },
            { name: 'Donator', value: `${user.isDonator ? "Yes" : "No"}` }
        )
        .setTimestamp()

        interaction.editReply({ embeds: [embed], ephemeral: true });
    }
}