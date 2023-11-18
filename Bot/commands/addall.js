const fs = require("fs");
const { MessageEmbed } = require("discord.js");
const User = require("../../AccountHandling/user.js");
const Profiles = require("../../AccountHandling/profiles.js");
const { profile } = require("console");

module.exports = {
    commandinfo: {
        name: "DevLocker",
        description: "Add Full Locker To A users account",
        options: [
            {
                name: "username",
                description: "Your Test Subject",
                required: true,
                type: 3 // string
            }
        ]
    },
    execute: async (interaction) => {
    const __dirname = dirname(import.meta);
    const selectedUser = interaction.options.getUser('user');
    const user = await UserFlags.findOne({ accountId: user.accountId});
    if (!profile)
        return interaction.reply({ content: "That user does not own an account", ephemeral: true});
    const allItems = destr(fs.readFileSync(path.join(__dirname, "../../../../AccountProfiles/allathena.json"), 'utf8'))
    if (!allItems)
        return interaction.reply({ content: "Failed to parse allathena.json", ephemeral: true});
    Profiles.findOneAndUpdate({ accountId: user.accountId }, { $set: { "profiles.athena.items": allItems.items}}, {new: true}, (err, doc) => {
        if (err)
            console.log(err);
    });
    user.GivenFullLocker = true;
    await interaction.reply({ content: "Sucessfully added all skins to the selected account", ephemeral: true});
    }
}