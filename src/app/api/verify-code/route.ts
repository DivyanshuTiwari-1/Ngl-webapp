import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { NextRequest } from "next/server";



export async function POST(Request:NextRequest){
    await dbConnect();
    try{
    const {username,code}   = await Request.json();
    const decodedUser= decodeURIComponent(username);
    const user =await UserModel.findOne({userName:decodedUser});
      
    if(!user){
        return Response.json({
            success: false,
            message: "user not found"
        }, {
            status: 500
        })
    }
    const isCodevaild=user.verifyCode === code
    const iscodeNotexpired= new Date(user.verifyCodeExpiary)>new Date()
     if(isCodevaild && iscodeNotexpired){
       return  Response.json({
            success:true,
            message:"Account verified successfully"
        },{
            status:200
        })
     }
     else if(!iscodeNotexpired){
        return  Response.json({
            success:false,
            message:"code is exiperd please sign up again to get new code"
        },{
            status:400
        })
     }
     else {
        return Response.json({
            success:false,
            message:"you have entered wrong code"
        })
     }


    }
    catch(err){
        console.error("error verifing code ",err);
        return Response.json({
            success: err,
            message: "Error checking username"
        }, {
            status: 500
        })
    }
}