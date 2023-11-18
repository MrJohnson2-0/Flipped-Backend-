const { Client, Intents, MessageEmbed } = require("discord.js"); // Discord.js v12 or v14 but WHY v13
const client = new Client({ intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES ] });
const fs = require("fs");
const config = JSON.parse(fs.readFileSync("./Globals/globals.json").toString());
const log = require("../Debugging/log.js");

client.once("ready", () => {
    log.bot("Bot is up and running!");

    let commands = client.application.commands;

    fs.readdirSync("./Bot/commands").forEach(fileName => {
        const command = require(`./commands/${fileName}`);

        commands.create(command.commandInfo);
    });
    sendStaticMessage();
    // Updates every, uh idk. My math teacher hates me anyways.
    setInterval(sendStaticMessage, 1 * 10 * 1000);
});




client.on("interactionCreate", interaction => {
    if (!interaction.isApplicationCommand()) return;

    if (fs.existsSync(`./Bot/commands/${interaction.commandName}.js`)) {
        require(`./commands/${interaction.commandName}.js`).execute(interaction);
    }
});

client.login(config.discord.bot_token);