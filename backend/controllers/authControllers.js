import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import Token from "../models/Token.js";
import sendVerificationMail from "../utils/sendMail.js";
import { genTokenAndSetCookies } from "../middlewares/genTokenAndSetCookies.js";

export const registerController = async (req, res) => {
    const {name, email, password} = req.body;
    if(!name || !email || !password) {
        return res.status(400).json({message: "All fields are required"});
    }

    try {
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(409).json({message: "User already exists"});
        }
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({name, email, password: hashedPassword});
        if(user) {
            const token = await Token.create({
                userID: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            });

            const url = `${process.env.BASE_URL}/api/auth/verify/${user._id}/${token.token}`;
        
            await sendVerificationMail(user.email, "Verify Your Email", url);

            res.status(201).json({message: "Registration successful! Please check your email to verify your account."});
        }else{
            res.status(400).json({message: "Invalid user data"});
        }
    } catch (error) {
        res.status(500).json({message: "Internal Server error"});
    }
}

export const verifyEmailController = async (req, res) => {
    const {id, token} = req.params;
    try {
        const user = await User.findById(id);
        if(!user) {
            return res.status(400).json({message: "Invalid link"});
        }

        const verifyToken = await Token.findOne({userID: id, token: token});

        if(!verifyToken) {
            return res.status(400).json({message: "Invalid link"});
        }

        user.isEmailVerified = true;
        await user.save();
        await verifyToken.deleteOne();

        res.status(200).json({message: "Email verified successfully! Please login."});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal Server error"});
    }
}

export const loginController = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        return res.status(400).json({message: "Please provide email and password"});
    }
    try {
        const user = await User.findOne({email});
        if(!user) {
            return res.status(401).json({message: "Invalid email or password"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials!"});
        }
        if(!user.isEmailVerified) {
            let verifyToken = await Token.findOne({userID: user._id});
            if(!verifyToken) {
                verifyToken = await Token.create({
                    userID: user._id,
                    token: crypto.randomBytes(32).toString("hex"),
                });
                const url = `${process.env.BASE_URL}/api/auth/verify/${user._id}/${verifyToken.token}`;
                await sendVerificationMail(user.email, "Verify Your Email", url);
            }
            return res.status(400).json({message: "An Email sent to your account. Please verify your email to login."});
        }

        genTokenAndSetCookies(res, user._id, user.role);
        res.status(200).json({message: "Login successful"});
    } catch (error) {
        res.status(500).json({message: "Internal Server error"});
    }
}

export const logoutController = (req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            expires: new Date(0),
        });
        res.status(200).json({message: "Logout successful"});
    } catch (error) {
        res.status(500).json({message: "Internal Server error"});
    }
}