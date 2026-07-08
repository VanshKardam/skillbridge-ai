const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const userModel = require("../models/user.model")

const bcrypt = require("bcryptjs")

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
    
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000
    })

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
    
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000
    })

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

    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })

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

const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        
        // 1. Ask Google to verify the token is real
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        
        // 2. Extract the user's data
        const payload = ticket.getPayload();
        const email = payload.email;
        const name = payload.name;
        
        // 3. Check if this email exists in Database
        let user = await userModel.findOne({ email });

        if (!user) {
            // If they don't exist, create a new user account with a random secure password
            const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
            const hashedPassword = await bcrypt.hash(randomPassword, 10);
            
            user = await userModel.create({
                username: name,
                email: email,
                password: hashedPassword
            });
        }
        
        // 4. Generate the JWT token (identical to normal login)
        const jwtToken = jwt.sign(
            {id: user._id, username: user.username},
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        );
        
        // 5. Set the HTTP-Only cookie so the browser remembers they are logged in
        res.cookie("token", jwtToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000
        });
        
        return res.status(200).json({ 
            success: true, 
            message: "Google login successful", 
            user: { 
                id: user._id,
                username: user.username,
                email: user.email 
            } 
        });

    } catch (error) {
        console.error("Google Auth Error:", error);
        return res.status(401).json({ success: false, message: "Invalid Google Token" });
    }
};


module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController,
    googleLogin
}