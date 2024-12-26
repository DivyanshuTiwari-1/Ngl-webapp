import { dbConnect } from "@/lib/dbConnect";
import UserModel, { User } from "@/models/User";
import { sendVerificationEmail } from "@/helpers/sendverificationemail";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  await dbConnect(); // Ensure DB connection

  try {
    const { userName, email, password } = await req.json();

    // Check if the username already exists
    const existingUserByUserName = await UserModel.findOne({
      userName,
      isVerified: true, // Ensure they are verified
    });
    if (existingUserByUserName) {
      return new Response(JSON.stringify({
        success: false,
        message: "Username is already taken."
      }), {
        status: 500
      });
    }

    // Check if the email already exists
    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(1000 + Math.random() * 9000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return new Response(JSON.stringify({
          success: false,
          message: "User already exists."
        }), {
          status: 500
        });
      } else {
        // Update the existing user with new password and verify code
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiary = new Date(Date.now() + 10800000); // 1-hour expiry
        await existingUserByEmail.save();
      }
    } else {
      // Create a new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date(Date.now() + 10800000);
      // 1-hour expiry

      const newUser = new UserModel({
        userName,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: true, // Set as not verified
        isAcceptingMessages: false,
        messages: []
      });

      await newUser.save();
    }

    // Send verification email
    const emailResponse = await sendVerificationEmail(email, userName, verifyCode);
    if (!emailResponse.success) {
      console.error("Verification email failed.");
      return new Response(JSON.stringify({
        success: false,
        message: emailResponse.message
      }), {
        status: 500
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: "User saved successfully, verification email sent."
    }), {
      status: 200
    });

  } catch (error) {
    console.error("Error registering user", error);
    return new Response(JSON.stringify({
      success: false,
      message: "Error registering user"
    }), {
      status: 500
    });
  }
}
