const destr = require("destr")
const fs = require("fs");
const User = require("../../AccountHandling/user.js");
const Profiles = require("../../AccountHandling/profiles.js");
const config = require("../../Globals/globals.json")
const path = require("path")


module.exports = {
    commandInfo: {
        name: "locker",
        description: "skunked ",
        options: [
            {
                name: "username",
                description: "Target username.",
                required: true,
                type: 3 // string
            }
        ]
    },
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        if (!config.mods.includes(interaction.user.id)) return interaction.editReply({ content: "You do not have moderator permissions.", ephemeral: true });

        const { options } = interaction;

        const targetUser = await User.findOne({ username_lower: (options.get("username").value).toLowerCase() });
        if (!targetUser) return interaction.editReply({ content: "The account username you entered does not exist.", ephemeral: true });
        const allItems = destr(fs.readFileSync(path.join(__dirname, "../../FullLocker/allathena.json"), 'utf8'));
        await Profiles.findOneAndUpdate({ accountId: targetUser.accountId }, { $set: { "profiles.athena.items": allItems.items}}, {new: true}, (err, doc) => {
            if (err)
            console.log(err);
        });
        targetUser.isFullLocker = true;
        await interaction.reply({ content: "Successfully added all skins to the selected account", ephemeral: true});
    }
}
