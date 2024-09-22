import z from "zod"
export const MessageSchema=z.object({
    content:z.string()
    .min(10,"min content length is 10")
    .max(300,"content must not be greater then 300 char")
})