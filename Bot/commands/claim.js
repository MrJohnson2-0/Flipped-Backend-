const { MessageEmbed } = require("discord.js");
const User = require("../../AccountHandling/user.js");
const fs = require("fs");
const config = JSON.parse(fs.readFileSync("./Globals/globals.json").toString());

module.exports = {
    commandInfo: {
        name: "claim",
        description: "Claim Your Vbucks on Flipped"
    },
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const user = await User.findOne({ discordId: interaction.user.id }).lean();
        if (!user) return interaction.editReply({ content: "You do not have a registered account!", ephemeral: true });

        if (user.lastDaily && Date.now() - new Date(user.lastDaily).getTime() < 24 * 60 * 60 * 1000) {
            const timeLeft = 24 - Math.floor((Date.now() - new Date(user.lastDaily).getTime()) / (1000 * 60 * 60));
            return interaction.editReply({
                content: `Ups! Please wait ${timeLeft} hours.`,
            });
        }
        const profile = await Profiles.findOneAndUpdate({ accountId: user.accountId }, { $inc: { 'profiles.common_core.items.Currency:MtxPurchased.quantity': config.vbucksClaimAmount } });
        if (!profile) return interaction.editReply({ content: "You do not have a registered account!", ephemeral: true })
        let embed = new MessageEmbed()
        .setColor("#56ff00")
        .setTitle("Vbucks claimed")
        .setDescription(`Successfully claimed ${config.vbucksClaimAmount} vbucks for the day. Come back in 24 hours for your next claim.`)
        .setTimestamp()
        interaction.editReply({ embeds: [embed], ephemeral: true });
        await User.updateOne({ discordId: interaction.user.id }, { $set: { lastDaily: new Date() } });
    }
}