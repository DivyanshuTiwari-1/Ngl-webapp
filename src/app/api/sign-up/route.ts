import { dbConnect } from "@/lib/dbConnect";
import UserModel, { User } from "@/models/User";
import { sendverificationEmail } from "@/helpers/sendverificationemail";
import bcrypt from "bcrypt";
export async function POST(req: Request) {
  await dbConnect()
  console.log("dbconnected");
  try {

    const { userName, email, password } = await req.json();
    const existingUserByUserName = await UserModel.findOne({
      userName,
      isverifed:true
    })
    if (existingUserByUserName) {
      return Response.json({
        success: false,
        message: "userName is  already taken"
      }, {
        status: 500
      })

    }
    const existingUserByEmail = await UserModel.findOne({ email })
    const verifyCode= Math.floor(1000+Math.random()*9000).toString();
    if (existingUserByEmail) {
          if(existingUserByEmail.isVerified){
            return Response.json({
              success: false,
              message: "useralreadyexists"
            }, {
              status: 500
            })
          }else {
            const hasedpaas= await bcrypt.hash(password,10);
            existingUserByEmail.password=hasedpaas;
            existingUserByEmail.email=email;
            existingUserByEmail.verifyCode=verifyCode;
            existingUserByEmail.verifyCodeExpiary= new Date(Date.now()+3600000);
            await existingUserByEmail.save()
          }



    }
   
    else{
      const hasedpassword=  await bcrypt.hash(password,10);
      const expiryDate =new Date();
      expiryDate.setHours(expiryDate.getHours()+1);
     const NewUser= await new UserModel(
      {
        userName,
        email,
        password:hasedpassword,
        verifyCode,
        expiryDate,
        isverifed:true,
        isAcceptingMessage:false,
        messsage:[]

      }
     )
     await NewUser.save();
    }
    const emailResonse = await sendverificationEmail(
      email,
      userName,
      verifyCode
    )
    if(!emailResonse.success){
      console.log("divyanshu");
      return Response.json({
        success: false,
        message: emailResonse.message
      }, {
        status: 500
      })
    }
    return Response.json({
      success: true,
      message: "user saved successfully and verification mail send to please cheack your email"
    }, {
      status: 200
    })

  }
  catch (error) {
    console.error("error registering user", error);
    return Response.json(
      {
        success: false,
        message: "error registering user"
      },
      {
        status: 500
      }

    )
  }

}