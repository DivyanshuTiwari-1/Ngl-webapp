import {z} from "zod"
export const userNamevaildation =z
 .string()
 .max(20," username must not be more then 20 characters ")
 .min(2,"username must be greater then 2 char")
 .regex(/^[a-zA-Z0-9_]+$/,"username must not contains speacial characters")


 export const signupSchema=z.object({
    userName:userNamevaildation,
    password:z.string().max(8,"password be less than 8 char"),
    email:z.string({message:"invaild email address"})

 })