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
const functions = require("./ItemShopHandler.json")

if (!fs.existsSync("./Settings")) fs.mkdirSync("./Settings");

const PORT = 3551;
const tokens = JSON.parse(fs.readFileSync("./TokenHandler/tokens.json").toString());

