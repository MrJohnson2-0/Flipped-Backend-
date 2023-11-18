const { MessageEmbed } = require("discord.js");
const functions = require("../../Functions/functions.js");

module.exports = {
    commandInfo: {
        name: "Register",
        description: "Register an Account on Flipped",
        options: [
            {
                name: "email",
                description: "Your email.",
                required: true,
                type: 3 // string
            },
            {
                name: "username",
                description: "Your username.",
                required: true,
                type: 3
            },
            {
                name: "password",
                description: "Your password.",
                required: true,
                type: 3
            }
        ],
    },
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const { options } = interaction;

        const discordId = interaction.user.id;
        const email = options.get("email").value;
        const username = options.get("username").value;
        const password = options.get("password").value;
        const user = await Users.findOne({ discordId: interaction.user.id });

        await functions.registerUser(discordId, username, email, password, false).then(resp => {
            const publicEmbed = new EmbedBuilder()
            .setTitle("New registration")
            .setColor("#FFFFFF")
            .setThumbnail(interaction.user.avatarURL({ format: 'png', dynamic: true, size: 256 }))
            .addFields({
                name: "Message",
                value: "Successfully created an account.",
            }, {
                name: "Username",
                value: username,
            }, {
                name: "Discord Tag",
                value: interaction.user.tag,
            })
            .setColor("#FFFFFF")
            .setFooter({
                text: "Flipped",
                iconURL: "https://i.ibb.co/8sd2063/image.png",
            })
            .setTimestamp();
        }).catch((err) => {
            log.error(err);
        });
    }
}