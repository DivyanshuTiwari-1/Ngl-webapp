import mongoose,{Schema,Document, Mongoose} from "mongoose"

 export interface Message extends Document{
    content:string,
    createdAt:Date
}

const MessageSchema :Schema<Message>= new Schema ({
        content:{
            type:String,
            required:true
        },
        createdAt:{
            type:Date,
            required:true,
            default:Date.now
        }
})

export interface User extends Document{
      userName:string;
      email:string;
      password:string;
      verifyCode:string;
      verifyCodeExpiary:Date;
      isVerified:boolean;
      isAcceptingMessage:boolean;
      messsage:Message[]

}
const UserSchema:Schema<User>=new Schema({
    userName:{
        type:String,
      
    },
   
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        match:[/.+\@.+\..+/,"Please enter the correct email"]
    },
    password:{
        type:String,
        required:[true,"Password is required"],
    },
    verifyCode:{
        type:String,
        required:[true,"VerifyCode"],
    },
    verifyCodeExpiary:{
        type:Date,
        default:Date.now,

    

    },
    isVerified:{
        type:Boolean,
        default:false

    },
    isAcceptingMessage:{
        type:Boolean,
        default:true,

    },
    messsage:[MessageSchema]

})

const UserModel= (mongoose.models.User as mongoose.Model<User>) ||mongoose.model<User>("User",UserSchema);
export default UserModel