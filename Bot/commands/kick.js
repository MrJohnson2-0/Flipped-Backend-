const User = require("../../AccountHandling/user.js");
const functions = require("../../Functions/functions.js");
const fs = require("fs");
const config = JSON.parse(fs.readFileSync("./Globals/globals.json").toString());

module.exports = {
    commandInfo: {
        name: "kick",
        description: "Kick a user out of Their Flipped Session",
        options: [
            {
                name: "username",
                description: "Username of person you want to kick",
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

        let refreshToken = global.refreshTokens.findIndex(i => i.accountId == targetUser.accountId);
        if (refreshToken != -1) global.refreshTokens.splice(refreshToken, 1);

        let accessToken = global.accessTokens.findIndex(i => i.accountId == targetUser.accountId);
        if (accessToken != -1) {
            global.accessTokens.splice(accessToken, 1);

            let xmppClient = global.Clients.find(client => client.accountId == targetUser.accountId);
            if (xmppClient) xmppClient.client.close();
        }

        if (accessToken != -1 || refreshToken != -1) {
            functions.UpdateTokens();
            
            return interaction.editReply({ content: `Successfully kicked ${targetUser.username}`, ephemeral: true });
        }
        interaction.editReply({ content: `There are no current active sessions by ${targetUser.username}`, ephemeral: true });
    }
}