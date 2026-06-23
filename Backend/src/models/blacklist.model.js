const mongoose = require("mongoose")

const blacklistTokenSchema = new mongoose.Schema({
    token: String,
    required: [true, "token is required to be added in blacklist"]
}, {
    timestamps: true
})

const tokenBlacklistModel = mongoose.model("blacklistTokens", blacklistTokenSchema)

module.exports = tokenBlacklistModel