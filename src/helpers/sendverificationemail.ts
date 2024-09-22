
import { resend } from "../lib/resend";
import { ApiResponse } from "../types/apiresponse";
import verificationEmails from "../../emails/verificationEmails";

export async function  sendverificationEmail(
    email:string,
    username:string,
    verifyCode:string
):Promise<ApiResponse>{
   try{
    await resend.emails.send({
      from: 'sontitiwa569@gmail.com',
      to: email,
      subject: 'hello world',
      react: verificationEmails ({username,otp:verifyCode})
    });

  return {
    success:true,
    message:"verification emails send succesfully"
  }
   }
   catch{
    return {
        success:false,
        message:"verification emails send not succesfully"
      }
   }
}























