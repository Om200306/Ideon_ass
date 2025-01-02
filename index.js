require('dotenv').config()
const express= require("express");
const connection = require('./dp/connection');
const jwt= require("jsonwebtoken");
const authRouter = require('./route/authRoute');
const appointRouter = require('./route/appointRoute');


const app=express();
app.use(express.json());


app.get("/",(req , res)=>{
    res.send("Welcome to Appintment booking app...")
})

app.use("/api",authRouter);


app.use((req,res,next)=>{

  const token = req.headers.authorization;

  try{  
  if(!token){
   return res.status(401).send("Unauthorized: No Provided")
  }
    
    let check= jwt.verify(token,process.env.SecretKey);
    req.user = check;
    
    next();

  }
  catch(err){
    console.log(err);
    
  }

})


app.use("/appointment",appointRouter)


app.listen(process.env.PORT,async ()=>{
    try{
       await connection;
    console.log("Server is connected");
  }
  catch(err){
    console.log("server is not connected")
  }
})