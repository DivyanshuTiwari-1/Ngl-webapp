import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/options";

export async function POST(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !user) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Not authenticated",
      }),
      { status: 401 }
    );
  }

  const userId = user._id;

  try {
    const { acceptMessages } = await req.json();

    

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Failed to update acceptingMessage status",
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Successfully updated acceptingMessage status",
        user: updatedUser,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating acceptingMessage status: ", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error updating acceptingMessage status",
      }),
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !user) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Not authenticated",
      }),
      { status: 401 }
    );
  }

  const userId = user._id;

  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User not found",
        }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        isAcceptingMessage: foundUser.isAcceptingMessage,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching acceptingMessage status: ", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error fetching acceptingMessage status",
      }),
      { status: 500 }
    );
  }
}
