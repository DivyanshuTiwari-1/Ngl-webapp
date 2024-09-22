import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import UserModel from "@/models/User";
import { dbConnect } from "@/lib/dbConnect";

export const authOptions:NextAuthOptions={

    providers :[
        CredentialsProvider({
            id:"Credentials",
            name:"Credentials",
            credentials: {
                username: { label: "Username", type: "text", },
                password: { label: "Password", type: "password" }
              },
              async authorize(Credentials:any):Promise<any>{
                 await dbConnect();
                     try {
                   const user= await  UserModel.findOne({
                            $or:[
                                { email:Credentials.identifier},
                                { username:Credentials.identifier}
                                
                            ]
                        })
                        if(!user){
                            throw new Error("No user found with this email")
                        }
                        if(!user.isVerified){
                            throw new Error(" please verify your account first")
                        }
                    const ispasswordCorrect=   await  bcrypt
                    .compare(Credentials.password,user.password);
                    if(ispasswordCorrect){
                       return user;
                    }
                     else {
                        throw new Error("incorrect password");
                     }

                     } catch (err:any){
                        throw new (err);
                     }
              }


})
    ],
    callbacks:{
       async jwt({token,user}){
         if(user){
            token.id=user._id;
            token.isverified=user.isverified;
            token.isAcceptingMessages=user.isAcceptingMessages;
            token.username=user.username;

         }
           return token
       },
       async session({session,token}){
        if(token){
            session.user._id=token._id;
            session.user.isAcceptingMessages=token.isAcceptingMessages;
            session.user.isverified=token.isverified;
            session.user.username=token.username
        }
            return session;
       }
    },
    pages:{
        signIn:'/sign-in'
    },
    session:{

        strategy:"jwt"
    },
    secret:process.env.NEXTAUTH_URL
}