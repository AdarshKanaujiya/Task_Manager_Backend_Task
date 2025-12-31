import bcrypt from 'bcrypt';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const registerUser = async (req,res)=>{
    try{
        const {name,email,password}= req.body;
        
        //simple validation
        if(!name || !email || !password){
            return res.status(400).json({message:'Please enter all fields'});
        }

        //normalized email
        const normalizedEmail = email.toLowerCase();

        //check for existing user
        const existingUser = await User.findOne({email: normalizedEmail}); 
        if(existingUser){
            return res.status(400).json({message:'User already exists'});
        }

        const hashedPassword = await bcrypt.hash(password,10);

        //create new user
        const newUser = await User.create({name,email:normalizedEmail,password:hashedPassword});
        await newUser.save();

        res.status(201).json({
            message:'User created successfully',
            user:{
                id:newUser._id,
                name:newUser.name,
                email:newUser.email,
            },
        });


    }catch(error){
        console.log(error);
        // res.status(500).json({message:'Server error'});
        next(error);
    
    }
}

export const loginUser = async (req,res)=>{
    try{
        const {email,password}= req.body;

        //simple validation
        if(!email || !password){
            return res.status(400).json({message:'Please enter all fields'});
        }

        //normalized email
        const normalizedEmail = email.toLowerCase();

        //check for existing user
        const user =await User.findOne({email:normalizedEmail});
        if(!user){
            return res.status(400).json({message:'User does not exist'});
        }

        //validate password
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:'Invalid credentials'});
        }

        //jwt and login success
        const token= jwt.sign(
            {id:user._id, role:user.role},
            process.env.JWT_SECRET,
            {expiresIn:'1h'}
        );

        res.cookie('token',token,{
            httpOnly:true,
            maxAge:60*60*1000, //1 hour
        });


        res.status(200).json({
            message:'Login successful',
            // token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
            },
        })
    }catch(error){
        console.log(error);
        // res.status(500).json({message:'Server error'});
        next(error);
    }
}

export const logoutUser = (req, res) => {
    try{
        res.clearCookie('token',{
            httpOnly: true,
            
        });
        res.status(200).json({ message: 'Logout successful' });
    }catch(error){
        console.log(error);
        next(error);
    }
}