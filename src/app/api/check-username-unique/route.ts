import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { userNamevaildation } from "@/schemas/signupSchema";
import { NextRequest } from "next/server";
import { z } from "zod"
const userNamequeryVaildation = z.object({
    username: userNamevaildation
})

export async function GET(Request: NextRequest) {

    await dbConnect();
    try {
        const { searchParams } = new URL(Request.url);

        const queryparams = {
            username: searchParams.get('username')
        }
        const result = userNamequeryVaildation.safeParse(queryparams);
        if (!result.success) {
            const usernameError = result.error.format()
                .username?._errors || []
            return Response.json({
                success: false,
                message: usernameError.length > 0
                    ? usernameError.join(',') : 'Invaild query parameters'
            }, { status: 400 })

        }
        const { username } = result.data
        const existingUserVerified = await UserModel.findOne({
             username,
            isVerified: true
        })
        if (!existingUserVerified) {
            return Response.json({
                success: true,
                message: "username is unique"

            }, { status: 500 })


        }
          return Response.json({
              success: false,
              message:'username is already taken'
          },{status:400})

        




    } catch (error) {
        console.error("error cheacking username", error);
        return Response.json({
            success: error,
            message: "Error checking username"
        }, {
            status: 500
        })
    }

}