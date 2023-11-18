const Users = require("../../AccountHandling/user.js");
const functions = require("../../Functions/functions.js");
const Profiles = require("../../AccountHandling/profiles.js");
const fs = require("fs");
const config = JSON.parse(fs.readFileSync("./Globals/globals.json").toString());

module.exports = {
    commandInfo: {
        name: "donator",
        description: "Give a user donator permissions",
        options: [
            {
                name: "username",
                description: "Who to give the username",
                required: true,
                type: 3 // user
            }
        ]
    },
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });
        
        if (!config.mods.includes(interaction.user.id)) return interaction.editReply({ content: "You do not have moderator permissions.", ephemeral: true });
    
        const { options } = interaction;

        const targetUser = await Users.findOne({ username_lower: (options.get("username").value).toLowerCase() });
     
         if (!targetUser)
            return interaction.editReply({ content: "That user does not have a account " + targetUserID, ephemeral: true });
    
         await Users.findOneAndUpdate({ username_lower: targetUser.username_lower }, { $set: { isDonator: !targetUser.isDonator } }, { new: true });
        interaction.editReply({ content: `Successfully gave ${targetUser.username_lower} Donator`, ephemeral: true });
    }
}