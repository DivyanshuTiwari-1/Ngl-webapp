import {z} from zod
export const verifySchema=z.object({
    code:z.string().len(6,"code must be 6 digits of length")

})
