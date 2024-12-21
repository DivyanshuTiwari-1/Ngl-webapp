import {z} from "zod"
export const  signinSchema=z.object({
    identifier:z.string({message:"username must be unique"}),
    password:z.string({message:"password must not be more than 8 character"})
})