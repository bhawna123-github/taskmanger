const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req,res,next)=>{
  
 try{
   const token =req.header('Authorization').replace("Bearer ","")
   const decode = jwt.verify(token, process.env.JWT_TOKEN)

   const user = await User.findOne({_id:decode._id, "tokens.token": token })

   if(!user)
   throw new Error()

 req.user = user
 req.token = token
   next()

 }catch(e){
  res.status(401).send("plaese authenticate")
 }

}

module.exports = auth


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1Zjk3OGRmM2VkMmEzODI1MGU0Mjk2MWYiLCJpYXQiOjE2MDM3Njc5MDl9.VVt40c09CYqGoKFKU06_dovDIiLp3bpsZSSQMS1POd