const { Client, Intents, MessageEmbed } = require("discord.js"); // Discord.js v12 or v14 but WHY v13
const client = new Client({ intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES ] });
const fs = require("fs");
const config = JSON.parse(fs.readFileSync("./Globals/globals.json").toString());
const log = require("../Debugging/logs.js");

client.once("ready", () => {
    log.bot("Bot is up and running!");

    let commands = client.application.commands;

    fs.readdirSync("./Bot/commands").forEach(fileName => {
        const command = require(`./commands/${fileName}`);

        commands.create(command.commandInfo);
    });
});




client.on("interactionCreate", interaction => {
    if (!interaction.isApplicationCommand()) return;

    if (fs.existsSync(`./Bot/commands/${interaction.commandName}.js`)) {
        require(`./commands/${interaction.commandName}.js`).execute(interaction);
    }
});

client.login(config.BotInformation.bot_token);