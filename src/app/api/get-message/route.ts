import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/options";
import mongoose from "mongoose";

export async function GET(req: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Not authenticated",
            }),
            { status: 401 }
        );
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const result = await UserModel.aggregate([
            { $match: { _id: userId } }, // Match by user ID
            { $unwind: "$messsage" }, // Unwind the 'messsage' array
            { $sort: { "messsage.createdAt": -1 } }, // Sort messages by createdAt
            {
                $group: {
                    _id: "$_id",
                    messages: { $push: "$messsage" }, // Collect messages into an array
                },
            },
        ]);

        if (!result || result.length === 0) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "User messages not found",
                }),
                { status: 404 }
            );
        }

        // Return the collected messages
        return new Response(
            JSON.stringify({
                success: true,
                Messages: result[0].messages,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching messages:", error);

        return new Response(
            JSON.stringify({
                success: false,
                message: "Error fetching messages",
            }),
            { status: 500 }
        );
    }
}
