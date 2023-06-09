import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/UserModel.js'

// REGISTER USER
export const register = async (req, res) =>{
    try{
        const {
            firstName,
            lastName,
            email,
            password,
            friends,
        } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password : passwordHash,
            friends,
        })

        const saveUser = await newUser.save();
        res.status(201).json(saveUser);
    }
    catch(err){
        res.status(500).json({error : err.message});
    }
}

// LOGGING IN
export const login = async (req,res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({ msg : "User does not exits"})
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(404).json({ msg : "Invalid credentials"});

        const token = jwt.sign({ id : user._id}, process.env.JWT_SECRET_KEY)
        delete user.password;
        res.status(200).json({token , user})
    }
    catch(err){
        res.status(409).json({message: err.message});
    }
}
