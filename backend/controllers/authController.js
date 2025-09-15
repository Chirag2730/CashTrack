import User from '../models/User.js';
import jwt from 'jsonwebtoken';

//generate JWT token
const generateToken= (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn:"7d",
    });
}

//Register user
export const registerUser = async(req,res)=>{
    const {fullName, email, password, profileImageUrl} = req.body;
    if(!fullName || !email || !password){
        return res.status(400).json({message:"All fields are required "});
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }

        // Create new user
        const user = await User.create({fullName, email, password, profileImageUrl});

        res.status(201).json({
            message:"User registered successfully",
            _id:user._id,
            user,
            token:generateToken(user._id),

        });
    } catch (error) {
        res.status(500).json({message:"Error registering user", error:error.message});
    }
}

//login user
export const loginUser = async(req,res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({message:"All fields are required"});
    }
    try {
        const user = await User.findOne({email});
        if(!user || !(await user.comparePassword(password))){
            return res.status(400).json({message:"Invalid email or password"});
        }

        res.status(200).json({
            id:user._id,
            user,
            token:generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({message:"Error in Login user", error:error.message});
    }
}

//getUserData 
export const getUserInfo = async(req,res)=>{
    try {
        const user = await User.findById(req.user.id).select("-password");
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message:"Error fetching user data", error:error.message});
    }
}
