import mongoose from "mongoose"

type ConnectionObject={
    isconnected?:number
}
const connection:ConnectionObject={}

 export async function dbConnect():Promise<void>{
    if(connection.isconnected){
        console.log("already connected")
    }
    try{
         const db= await mongoose.connect(process.env.MONGO_URI||'',{})
         connection.isconnected = db.connections[0].readyState
        console.log("Db connected succesfully")
    }
    catch(err){
        console.log("db connection failed",err);
        process.exit(1)
    }
}