import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";


export async function POST(req: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User
    if (!session || !user) {
        return Response.json({
            success: false,
            message: "not authenticated"
        }, { status: 401})
    }
    const userId = user._id;

    try {
       
        const acceptingMessage = await req.json();
        const updatedUser = UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptingMessage },
            { new: true }
        )

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: " failed to cheack wheather user accepting messageor not "
            }, { status: 500 })
        }
        return Response.json({
            success: true,
            message: " successfully changed the status of the accepting messages  ",
            updatedUser
        }, { status: 200})

    } catch (error) {
        console.log("error cheacking wheather user accepting messageor not ", error)
        return Response.json({
            success: false,
            message: "rror cheacking wheather user accepting messageor not"
        }, { status: 500 })
    }

}

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
    const userId = user._id;
  try {
  
        const foundUser =await UserModel.findById(userId);
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found",
            }, { status: 404 })
        }
        return Response.json({
            success: true,
            isAcceptingMessage:foundUser.isAcceptingMessage
        }, { status: 200 })

  } catch (error) {
    console.log("error cheacking wheather user accepting messageor not ", error)
        return Response.json({
            success: false,
            message: "error cheacking wheather user accepting messageor not"
        }, { status: 500 })
  }
    
}