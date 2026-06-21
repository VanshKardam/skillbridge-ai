const express = require("express");

const app = express()

// Middleware for parsing JSON
app.use(express.json())

// Import and use auth routes
const authRouter = require("./routes/auth.routes")

// Using all the routes here
app.use("/api/auth", authRouter)

module.exports = app