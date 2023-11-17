const express = require("express");
const app = express();
const mongoose = require("mongoose");
const fs = require("fs");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const cron = require('node-cron');
const globals = JSON.parse(fs.readFileSync("./Globals/Globals.json").toString());
const log = require("./Debugging/Logs.js")
const errorHandler = require("./Debugging/error.js")
const functions = require("./Functions/functions.js")

global.JWT_SECRET = functions.MakeID();
if (!fs.existsSync("./Settings")) fs.mkdirSync("./Settings");

const PORT = 3551;
const tokens = JSON.parse(fs.readFileSync("./TokenHandler/tokens.json").toString());

for (let tokenType in tokens) {
    for (let tokenIndex in tokens[tokenType]) {
        let decodedToken = jwt.decode(tokens[tokenType][tokenIndex].token.replace("eg1~", ""));

        if (DateAddHours(new Date(decodedToken.creation_date), decodedToken.hours_expire).getTime() <= new Date().getTime()) {
            tokens[tokenType].splice(Number(tokenIndex), 1);
        }
    }
}

fs.writeFileSync("./TokenHandler/tokens.json", JSON.stringify(tokens, null, 2));

global.accessTokens = tokens.accessTokens;
global.refreshTokens = tokens.refreshTokens;
global.clientTokens = tokens.clientTokens;

global.exchangeCodes = [];

mongoose.connect(config.mongodb.database, () => {
    log.backend("App successfully connected to MongoDB!");
    functions.advancedLog("SERVER", "Connected to Database");
});

mongoose.connection.on("error", err => {
    log.error("MongoDB failed to connect, please make sure you have MongoDB installed and running.");
    functions.advancedLog("SERVER", "Error while connecting to Database");
    throw err;
});

app.use(rateLimit({ windowMs: 0.5 * 60 * 1000, max: 45 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

fs.readdirSync("./Api").forEach(fileName => {
    app.use(require(`./Api/${fileName}`));
});

fs.readdirSync("./Redirects").forEach(fileName => {
    app.use(require(`./Redirects/${fileName}`));
});
