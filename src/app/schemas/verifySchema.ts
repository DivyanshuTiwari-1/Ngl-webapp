import {z} from "zod"
export const verifySchema=z.object({
    code:z.string().length(4,"code must be 4 digits of length")

})
