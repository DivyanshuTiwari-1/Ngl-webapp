import NextAuth from "next-auth";
import { authOptions } from "../options"; // Ensure the relative path is correct

const handler = NextAuth(authOptions);

export const GET = handler;
export const POST = handler;

