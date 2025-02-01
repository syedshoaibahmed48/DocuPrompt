import { NextRequest, NextResponse } from "next/server";
import { generateJWT } from "@/lib/JwtUtils";
import { getUserByNameOrEmail, saveNewUser } from "@/lib/mongodbClient";

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json();
        const { fingerprint } = reqBody;

        //If new user, save user
        const userExists = await getUserByNameOrEmail(`demoUser-${fingerprint}`);
        const savedUser = (!userExists)? await saveNewUser(`demoUser-${fingerprint}`, `demoUser-${fingerprint}@mail.com`, "demoUser-password", "demo") : userExists;
        // generate JWT
        const authToken = generateJWT(savedUser._id, "demo");       

        // return token in cookies
        const response = NextResponse.json({ success: true }, { status: 201 });
        response.cookies.set("AuthToken", authToken, { httpOnly: true });
        return response
    } catch (error) {
        console.error(error);
        return NextResponse.json({ errorCode: "SERVER_ERROR" }, { status: 500 });
    }
}