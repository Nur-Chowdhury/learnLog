import bcrypt from "bcryptjs";
import User from "../models/User.js";
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
        await User.create({name, email, password: hashedPassword});
        
        res.status(201).json({message: "Registration successful! Please Log In."});
    } catch (error) {
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

        console.log(user);

        genTokenAndSetCookies(res, user._id, user.role);
        res.status(200).json({message: "Login successful!"});
    } catch (error) {
        console.log(error);
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