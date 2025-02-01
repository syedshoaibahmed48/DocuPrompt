import mongoose from "mongoose";
import { UserDocument } from "@/models/app-interfaces";

function isPasswordRequired(this: UserDocument){
    return this.userType !== "demo";
}

const userSchema = new mongoose.Schema<UserDocument>({
    userName:{
        type: String,
        required: [true, "Please provide a user name"],
        unique: true
    },
    email:{
        type: String,
        required: [true, "Please provide an email"],
        unique: true
    },
    password:{
        type: String,
        required: isPasswordRequired
    },
    userType:{
        type: String,
        enum: ["demo", "standard", "admin"],
        required: true
    }
}, {collection: "users"});

const User = mongoose.models.users || mongoose.model<UserDocument>("users", userSchema);

export default User;