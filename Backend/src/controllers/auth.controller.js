const userModel = require("../models/user.model")

const bcryptjs = require("bcryptjs")

const jwt = require("jsonwebtoken")

/**
 * @name registerUserController
 * @description Register a new user, expects username, email, password
 * @access Public
 */

async function registerUserController(req, res) {
    const {username,email,password} = req.body

    if(!username || !email || !password){
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        })
    }

    const isUserRegistered = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })

    // Checking if user is already registered
    if(isUserRegistered){
        return res.status(400).json({
            success: false,
            message: "User already registered"
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    const token = jwt.sign(
        {id: user._id, username: user.username},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )
    
    res.cookie("token", token)

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

/**
 * @name loginUserController
 * @description Login a user, expects email, password
 * @access Public
 */

async function loginUserController(req, res) {
    const {email, password} = req.body

    const user = await userModel.findOne({email})

    if(!user){
        return res.status(400).json({
            success: false,
            message: "User not registered"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
        return res.status(400).json({
            success: false,
            message: "Invalid password"
        })
    }

    const token = jwt.sign(
        {id: user._id, username: user.username},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )
    
    res.cookie("token", token)

    res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

/**
 * @name logoutUserController
 * @description logout user, add token to blacklist and clear token from cookie
 * @access Public
 */

async function logoutUserController(req, res) {
    const {token} = req.cookies

    if(!token){
        return res.status(400).json({
            success: false,
            message: "Token not found"
        })
    }

    await tokenBlacklistModel.create({
        token
    })

    res.clearCookie("token")

    res.status(200).json({
        success: true,
        message: "User logged out successfully"
    })
}

/**
 * @name getMeController
 * @description get the currently logged in user profile
 * @access Private
 */

async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id)

    if(!user){
        return res.status(404).json({
            success: false,
            message: "User not found"
        })
    }

    res.status(200).json({
        message: "User fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}