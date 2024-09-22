import { Message } from "../models/User";

export  interface ApiResponse {
   success:Boolean;
   message:string;
   isAcceptingMessage?:boolean;
   Messages?:Array<Message>

}