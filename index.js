require('dotenv').config()
const express= require("express");
const connection = require('./dp/connection');
const jwt= require("jsonwebtoken");
const authRouter = require('./route/authRoute');
const appointRouter = require('./route/appointRoute');
const cors= require("cors");
const { userModel } = require('./model/model');


const app=express();
app.use(express.json());
app.use(cors());

app.get("/",(req , res)=>{
    res.send("Welcome to Appintment booking app...")
})

app.use("/api",authRouter);


let authorize=(req,res,next)=>{

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

}

app.get("/profile", async (req, res) => {
  const token = req.headers.authorization;

  try {
    if (!token) {
      return res.status(401).send("Token not provided");
    }

    const check = jwt.verify(token, process.env.SecretKey);

    const user = await userModel.findOne({ _id: check.id });

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error occurred:", err);
    
    if (err.name === "JsonWebTokenError") {
      return res.status(401).send("Invalid token");
    }
    
    res.status(500).send("Internal server error");
  }
});



app.use("/appointment",appointRouter);

app.listen(process.env.PORT,async ()=>{
    try{
       await connection;
    console.log("Server is connected");
  }
  catch(err){
    console.log("server is not connected")
  }
})