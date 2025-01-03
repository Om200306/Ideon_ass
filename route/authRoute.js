
const {Router} = require("express");
const { userModel } = require("../model/model");
require('dotenv').config()
const jwt= require("jsonwebtoken");

const authRouter= new Router();


authRouter.get("/all", async(req,res)=>{
       try{
          let user=await userModel.find();

          if(user){
         return res.status(200).json(user);
        }
            res.status(400).send("no user found");

       }
       catch(err){
        console.log(err);
       }
})

authRouter.post("/signup",async (req,res)=>{
    let {name ,email,password ,role}= req.body;

    if(!name || !email || !password){
        return res.send("fill all the fields");
    }
  try{
    
       let user= await userModel.findOne({email});

       if(user){
        return res.status(400).send("already have accound");
       }

       await userModel.create({name , email,password,role});
       res.status(201).send("Account created sucessfully");

  }
  catch(err){
    console.log(err);
    
  }

})


authRouter.post("/login",async (req , res)=>{
      let {name ,email,password}= req.body;

      if(!email , !password){
        return res.send("fill all the fields");
      }

      try{
            let user= await userModel.findOne({email});

            if(!user){
              return res.status(401).send("Invalid Credentials");
            }

            if(user.password !== password){
              return res.status(401).send("Invalid Credentials");
            }


            const token = jwt.sign(
              { id: user._id, name: user.name , role:user.role},
              process.env.SecretKey ,
              { expiresIn: "1h" }
          );

              return res.status(201).send({message:"Login Sucessfully" , token});

           
      }
      catch(err){
        console.log(err);
        
      }
})



module.exports=authRouter;