import jwt from 'jsonwebtoken'


const isAuth=async(req,res,next)=>{
  try {
    
     const {token}=req.cookies
    
        if(!token){
             res.status(404).json({success:false,message:"user does not have token"})
        }
      const verifytoken=jwt.verify(token,process.env.JWT_SECRET)
      if(!verifytoken){
         res.status(404).json({success:false,message:"user does not have valid token"})
      }
      req.userId=verifytoken.id
      next()
    
  } catch (error) {
    console.log(error)
     res.status(500).json({message:'is auth errro'})
  }
}
export default isAuth;