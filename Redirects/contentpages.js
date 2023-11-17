const express = require("express");
const app = express.Router();
const functions = require("../Functions/functions.js");

app.get("/content/api/pages/*", async (req, res) => {
    const contentpages = functions.getContentPages(req);

    res.json(contentpages);
});

module.exports = app;