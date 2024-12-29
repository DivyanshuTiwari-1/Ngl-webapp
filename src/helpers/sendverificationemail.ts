import { Resend } from 'resend';
import verificationEmails from '../../emails/verificationEmails';
import { ApiResponse } from '../types/apiresponse';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: 'sontitiwa569@gmail.com',
      to: [email],
      subject: 'Verification Code',
      react: verificationEmails({ username, otp: verifyCode }),
    });
    console.log("Email sent successfully");
    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (error) {
    console.error("Failed to send email:", error);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
