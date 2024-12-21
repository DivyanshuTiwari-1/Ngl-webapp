import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/options";
import mongoose from "mongoose";

export async function GET(req:Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User
    if (!session || !user) {
        return Response.json({
            success: false,
            message: "not authenticated"
        }, { status: 401})
    }
    
    const userId= new mongoose.Types.ObjectId(user._id);
   try {
     const user = await UserModel.aggregate([
        {$match:{id:userId}},
        {$unwind:'$messages'},
        {$sort:{'messages.createdAt':-1}},
        {$group:{_id:'$_id',messages:{$push:'$messages'}}}
        
     ])

     if(!user|| user.length === 0){
        return Response.json({
            success: false,
            message: " user messages not found"
        }, { status: 404})
     }
     return Response.json({
        success: true,
        message: user[0].messages,
    }, { status: 200})
   

   } catch (error) {
      console.log("error getting messages ", error)
        return Response.json({
            success: false,
            message: "error getting message"
        }, { status: 500 })
   }
    
}