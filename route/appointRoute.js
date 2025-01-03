const {Router}= require("express");
const { appointmentModel } = require("../model/model");
const roleCheck = require("../middleware/rba");
const jwt= require("jsonwebtoken");
require('dotenv').config()

const appointRouter= new Router();



appointRouter.get("/slot",async (req , res)=>{
        
     try{
            let data= await appointmentModel.find();

            if(!data){
               return res.status(400).send("no data found");
            }

            res.status(201).json(data);
     }
     catch(err){
      console.log(err);
      
     }

})

appointRouter.post("/slot/booking",roleCheck(["admin"]),async (req,res)=>{

  const token = req.headers.authorization;

   const check = jwt.verify(token, process.env.SecretKey);

     let {date,day,startTime,endTime,isBooked,userId,adminId=check.id}=req.body;

     if(!date || !day || !startTime || !endTime){
        return res.send("fill all the fields");
     }

     try{

        let check= await appointmentModel.findOne({startTime});
      
        if(check){
            return res.status(400).send("this time slot is booked");
        }

        await appointmentModel.create({date,day,startTime,endTime,isBooked,userId,adminId});
           res.status(201).send("slot booked sucessfully");
     }
     catch(err){
        console.log(err);
     }

})

appointRouter.get("/slot/:date" , async(req , res)=>{

     let date= req.params.date;

     try{
      

         let appoin= await appointmentModel.find({date:{
            $eq:date
         }})

         if(appoin){
           return res.status(201).json(appoin);
         }

         res.status(400).send("no data found");

     }
     catch(err){
      console.log(err);
      
     }

})




appointRouter.patch("/bookSlot/:id", async (req, res) => {

  const userId = req.params.id;
  let {userNum}= req.body;

  try {

    const data = await appointmentModel.findOne({ _id: userId });

    if (!data) {
      return res.status(404).send("No appointment found for the provided ID");
    }

    const updated = await appointmentModel.updateOne(
      { _id: userId },
      { $set: { isBooked: !data.isBooked ,userId: data.isBooked ? "0": userNum} }
    );

    if (updated.modifiedCount > 0) {
      res.status(200).send("Slot status toggled successfully");
    } else {
      res.status(400).send("Failed to toggle slot status");
    }
  } catch (err) {
    console.error("Error toggling slot status:", err);
    res.status(500).send("An error occurred while toggling slot status");
  }
});


appointRouter.get("/byUser/:id", async (req ,res)=>{

       const userid= req.params.id;
  
       try{

          let data= await appointmentModel.find({userId:userid});

          if(!data){
            res.status(400).send("no data found");
          }
          
            res.status(201).json(data);

       }
       catch(err){
        console.log(err);
        
       }

})

appointRouter.get("/byAdmin/:id", async (req ,res)=>{

  const adminid= req.params.id;

  try{

     let data= await appointmentModel.find({adminId:adminid});

     if(!data){
       res.status(400).send("no data found");
     }
     
       res.status(201).json(data);

  }
  catch(err){
   console.log(err);
   
  }

})

appointRouter.delete("/bookSlot/:id", roleCheck(["admin"]),async (req, res) => {
   const userId = req.params.id;
 
   try {
     console.log("Deleting slot for userId:", userId);
 
   
     const data = await appointmentModel.findOne({_id:userId});
 
     if (!data) {
       return res.status(404).send("No appointment found for the provided ID");
     }
 
     
     await appointmentModel.deleteOne({_id:userId});
 
     res.status(200).send("Slot deleted successfully");
   } catch (err) {
     console.error("Error deleting slot:", err);
     res.status(500).send("An error occurred while deleting the slot");
   }
 });
 



module.exports=appointRouter;