import { dbConnect } from "@/lib/dbConnect";
import UserModel, { Message } from "@/models/User";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req:Request) {
    await dbConnect();
     const {username,content}= await req.json();

     try {
        const user = await UserModel.findOne({username});
        if(!user){
            return Response.json({
                success: false,
                message: " user not found"
            }, { status: 404})
        }
        if (!user.isAcceptingMessage){
            return Response.json({
                success: false,
                message: "user is not accepting messages"
            }, { status: 403})
        }

        const newMessag= {content,createdAt:new Date()}
        user.messsage.push(newMessag as Message)
        await user.save()
        return Response.json({
            success: true,
            message: "messages sent successfully"
        }, { status: 200})

     } catch (error) {
        console.log("error sending messages ", error)
        return Response.json({
            success: false,
            message: "error sending messages"
        }, { status: 500 })
     }
    
}