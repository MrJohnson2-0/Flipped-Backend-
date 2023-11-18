const User = require("../../AccountHandling/user.js");
const functions = require("../../Functions/functions.js");
const Profiles = require("../../AccountHandling/profiles.js");
const fs = require("fs");
const config = JSON.parse(fs.readFileSync("./Globals/globals.json").toString());

module.exports = {
    commandInfo: {
        name: "cosmetic",
        description: "Give a cosmetic to a user",
        options: [
            {
                name: "username",
                description: "Target username.",
                required: true,
                type: 3 // string
            },
            {
                name: "cosmetic",
                description: "Type The Name Of Skin Here",
                required: true,
                type: 3 // string
            }
        ]
    },
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });
        
        if (!config.moderators.includes(interaction.user.id)) return interaction.editReply({ content: "You do not have moderator permissions.", ephemeral: true });
    
        const { options } = interaction;
        const targetUser = await User.findOne({ username_lower: (options.get("username").value).toLowerCase() });
        if (!targetUser) return interaction.editReply({ content: "The account username you entered does not exist.", ephemeral: true });

        const profile = await Profiles.findOne({ accountId: targetUser.accountId });
        if (!profile)
            return interaction.reply({ content: "The user has not account registered", ephemeral: true });


            const cosmeticname = interaction.options.getString('cosmeticname');
            const cosmeticCheck = await asteria.getCosmetic("name", cosmeticname, false);
            const regex = /^(?:[A-Z][a-z]*\b\s*)+$/;
            if (!regex.test(cosmeticname))
                return await interaction.editReply({ content: "The format off the name is incorrect" });
            let cosmetic = {};
            try {
                cosmetic = await asteria.getCosmetic("name", cosmeticname, false);
            }
            catch (err) {
                return await interaction.editReply({ content: "Could not find the cosmetic" });
            }
            finally {
                try {
                    if (profile.profiles.athena.items[`${cosmeticCheck.type.backendValue}:${cosmeticCheck.id}`])
                        return await interaction.editReply({ content: "That user already has that cosmetic" });
                }
                catch (err) {
                    await fetch(`https://fortnite-api.com/v2/cosmetics/br/search?name=${cosmeticname}`).then(res => res.json()).then(async (json) => {
                        const cosmeticFromAPI = json.data;
                        if (profile.profiles.athena.items[`${cosmeticFromAPI.type.backendValue}:${cosmeticFromAPI.id}`]) {
                            await interaction.editReply({ content: "That user already has that cosmetic" });
                            return;
                        }
                        cosmetic = cosmeticFromAPI;
                    });
                }
            }
            await Profiles.findOneAndUpdate({ accountId: targetUser.accountId }, {
                $set: {
                    [`profiles.athena.items.${cosmetic.type.backendValue}:${cosmetic.id}`]: {
                        templateId: `${cosmetic.type.backendValue}:${cosmetic.id}`,
                        attributes: {
                            item_seen: false,
                            variants: [],
                            favorite: false,
                        },
                        "quantity": 1,
                    },
                },
            }, { new: true })
                .catch((err) => {
            });
            interaction.editReply({ content: `Successfully gave  ${cosmetic.name}`, ephemeral: true });
    }
}