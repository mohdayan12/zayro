import jwt from 'jsonwebtoken'


const isAuth=async(req,res,next)=>{
  try {
    
     const {token}=req.cookies
    
        if(!token){
         return res.status(401).json({success:false,message:"user does not have token"})
        }
      const verifytoken=jwt.verify(token,process.env.JWT_SECRET)
     
      req.userId=verifytoken.id
       return next()
    
  } catch (error) {
    console.log(error)
    return  res.status(401).json({ success:false,message:'invalid and expire token'})
  }
}
export default isAuth;