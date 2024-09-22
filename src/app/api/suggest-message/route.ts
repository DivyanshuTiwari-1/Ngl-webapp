
import { GoogleGenerativeAI } from "@google/generative-ai";
export async function GET(req:Request){
 
 try {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY|| "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = "Write a story about a magic backpack.";
    
    const result = await model.generateContent(prompt);
    console.log(result.response.text());

      return Response.json({
        success:true,
        message:result.response.text()
    },{status:200})

 } catch (error) {
    console.error("error genrating text",error);
    return Response.json({
        success:false,
        message:"error generating messages"
    },{status:500})

 }


}
