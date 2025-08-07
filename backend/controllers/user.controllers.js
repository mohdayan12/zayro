import  User  from "../models/user.models.js"
import nodemailer from 'nodemailer'
import { sendOtp } from "../utils/sendOtp.js"
import bcrypt from 'bcrypt'
const getCurrentUser=async(req ,res)=>{
   
    try {
        const user=await User.findById(req.userId).select("-password").populate('listing').populate('booking')
         if(!user){
          return  res.status(404).json({success:false,message:"user does not found"})
          }
          return res.status(200).json({success:true,user})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, message:"Server Error!"})
    }
}
const forgetPassword=async(req,res)=>{
  const {email}=req.body
  try {
      const user=await User.findOne({email})
      if(!user){
          return  res.status(404).json({success:false,message:"user does not found"})
      }
      const otp=Math.floor(1000+Math.random()*9000)
       user.otp=otp;
      user.otpExpire=Date.now()+2*60*1000;
      await user.save()
      await sendOtp(email,otp)
       res.status(200).json({success:true, message:"Otp send to your email "})
  } catch (error) {
    console.log(error)
        res.status(500).json({success:false, message:" Server Error!"})
  }
}
 
 const verifyOtp=async(req,res)=>{
   const {email,otp}=req.body;
  try {
 
  if(!email || !otp){
   return res.status(404).json({success:false,message:"Please provide email and otp"})
  }

  const user=await User.findOne({email})
   if(!user){
    return res.status(404).json({success:false,message:"User not found"})

   }
   if(user.otp!==otp){
   return res.status(404).json({success:false,message:"Otp is not matached"})
   }
   
   if(user.otp!==otp || (user.otpExpire && user.otpExpire<Date.now()) ){
    return  res.status(404).json({success:false,message:"Otp is expired"})
   }
    user.otp=undefined;
    user.otpExpire=undefined;
    await user.save();
   res.status(200).json({success:true,message:'Otp is Verified'})
  
    
  } catch (error) {
     console.log(error)
    res.status(500).json({success:false,message:"Sever Error!"})
  }
 }

  const resetOtp=async(req,res)=>{
   const {email}=req.body
   try {
    if(!email){
    return res.status(404).json({success:false,message:"Email is required"})
    }
    const user=await User.findOne({email})
 
    if(!user){
     return res.status(404).json({success:false,message:"User is not found"})
    }
    const otp=Math.floor(1000+Math.random()*9000)
    user.otp=otp;
    user.otpExpire=Date.now()+2*60*1000;
    await user.save()
    await sendOtp(email,otp)
     res.status(200).json({success:true, message:"Otp send to your email again"})
     
   } catch (error) {
      console.log(error)
     res.status(500).json({success:false,message:"Server Error!"})
   }
   
   }

     const resetPassword=async(req,res)=>{
  const {email,newPassword,confirmPassword}=req.body;

  try {
   if(!email){
  return res.status(404).json({success:false,message:'Email is required'})
  }
  const user=await User.findOne({email})
  if(!user){
   return res.status(404).json({success:false,message:"User is not found"})
  }
   if(newPassword!==confirmPassword){
    return res.status(404).json({success:false,message:"Confrim password is not match"})
   }
  if(newPassword.length<8){
     return res.status(404).json({success:false, message:"please provide a strong password"})
  }

  const hashPassword= await bcrypt.hash(newPassword,10)

  user.password=hashPassword;
   await user.save();
  res.status(200).json({success:true,message:"Your Password is changed"})
    
  } catch (error) {
       console.log(error)
    res.status(500).json({success:false,message:"Server Error!"})
  } 
  }

const sendMessage=async(req,res)=>{
  const { name, email, message } = req.body;

  try {
    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD
      }
    });

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.MY_EMAIL, // owner email
      subject: `New Contact from ${name}`,
      html: `
        <h3>You've received a new message via Contact Form:</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true ,message:"Message send successfully" });
  } catch (error) {
    console.error("Email send error:", error.message);
    res.status(500).json({ success: false, message:"Server Error!" });
  }
}
export {getCurrentUser,sendMessage,forgetPassword,verifyOtp,resetOtp,resetPassword}