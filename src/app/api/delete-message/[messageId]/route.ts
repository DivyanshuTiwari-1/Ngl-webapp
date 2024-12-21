import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/options";
import { error } from "console";


export async function DELETE(req:Request,{params}:{params:{messageId:string}}) {
    const messageId = params.messageId;
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User
    if (!session || !user) {
        return Response.json({
            success: false,
            message: "not authenticated"
        }, { status: 401})
    }
    
        try {
            const updateResult = await UserModel.updateOne(
              { _id: user._id },
              { $pull: { messages: { _id: messageId } } }
            );
          
            if (updateResult.modifiedCount === 0) {
                return Response.json({
                    success: false,
                    message: "not update"
                }, { status: 404})
            }
            else{
                return Response.json({
                    success: true,
                    message: " updated"
                }, { status: 200})
            }
          }
        catch(err){
            console.log("error deleting message",err);
            return Response.json({
                success: false,
                message: "error"
            }, { status: 500})
        }
   
 
    
}