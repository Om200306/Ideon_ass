const {Schema , model}= require("mongoose");


   const appointmentSchema= new Schema({
      date:{
        type:String,
        required:true
      }
    ,
    day:{
        type:String,
        required:true
    },
    startTime:{
        type:String,
        required:true
    },
    endTime:{
        type:String,
        required:true
    },
    isBooked:{
        type:Boolean,
        required:true,
        default:false
    },
    userId:{
        type:String,
        default:"0"
    }
    
   })

   let userSchema= new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    }
   })


   const userModel= new model("Users",userSchema);
   const appointmentModel= new model("Appointment",appointmentSchema);

   module.exports={
    userModel,appointmentModel
   }