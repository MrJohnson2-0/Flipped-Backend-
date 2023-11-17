const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        created: { type: Date, required: true },
        banned: { type: Boolean, default: false },
        discordId: { type: String, required: true, unique: true },
        accountId: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        username_lower: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        mfa: { type: Boolean, default: false },
        isDonator: { type: Boolean, default: false},
        isFullLocker: { type: Boolean, default: false },
        isServer: { type: Boolean, default: false },
        isPriority: { type: Boolean, default: false },
        statisticsTop10: { type: Number, default: 0},
        statisticsTop5: { type: Number, default: 0},
        statisticsWins: { type: Number, default: 0},
        statisticsKills: { type: Number, default: 0},
        matchmakingId: { type: String, default: null },
        canCreateCodes: { type: Boolean, default: false },
        lastDaily: { type: Date, default: null }

    },
    {
        collection: "users"
    }
)

const model = mongoose.model('UserSchema', UserSchema);

module.exports = model;