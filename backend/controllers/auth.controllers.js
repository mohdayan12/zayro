import User from '../models/user.models.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';



const generateToken=async({id})=>{
    try {
         let token= jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"7d"})
         return token;
    } catch (error) {
        console.log('token error')
        
    }
}


const userLogin=async(req ,res)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.json({status:false,message:"plaease provide both"})
        }
        const user= await User.findOne({email})
        if(!user){
            return res.json({status:false,message:"user does not exits"})
        }

        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.json({status:false,message:'password is incorrect'});
        }
        const token= await generateToken({id:user._id})
       


         res.cookie("token",token, {
            httpOnly:true,
            maxAge:7*24*60*60*1000,
            sameSite: "strict",   
            secure:process.env.NODE_ENV === "production" 
        })
       


        return res.json({status:true,message:"user in logged in",user})
        
    } catch (error) {
        console.log(error);
        return res.json({status:false,message:error.message})
    }
}


 
const userSignup=async(req,res)=>{
    try {
    
        let {name,email,password}=req.body;
        if(!email ||!name || !password){
           return  res.json({status:true,message:"please provide a email"})
        }
        const user= await User.findOne({email})
        if(user){
          return res.json({status:false,message:"user already exists"})
        }
        if(password.length<8){
            return res.json({status:false,message:"Provide a strong password"})
        }
    
        const hashPassword= await bcrypt.hash(password,10);

        const newUser=await User.create({name,email,password:hashPassword});

        let token= await generateToken({id:newUser._id});

        res.cookie("token",token,{
            httpOnly:true,
            maxAge:7*24*60*60*1000,
            sameSite:"strict",
            secure:process.env.NODE_ENV === "production"
        })

       return res.json({status:true,message:"account created",newUser})

        
    } catch (error) {
        console.log(error);
        return res.json({status:false,message:error.message})
        
    }
}

const userLogout=async(req,res)=>{
    try {
        res.clearCookie("token", {
          httpOnly: true,
          sameSite: "strict",
           secure: process.env.NODE_ENV === "production",
});
        return res.json({status:true,message:"Logout Successfully"})
    } catch (error) {
         console.log(error);
        return res.json({status:false,message:error.message})
    }
}
export {userLogin,userSignup,userLogout};