import { NextRequest, NextResponse } from "next/server";
import { compare } from 'bcrypt';
import { generateJWT } from "@/lib/JwtUtils";
import { getUserByNameOrEmail } from "@/lib/mongodbClient";

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { usernameOrEmail, password } = reqBody;

        // check if user exists
        const savedUser = await getUserByNameOrEmail(usernameOrEmail);
        if (!savedUser) return NextResponse.json({ errorCode: "USER_NOT_FOUND" }, { status: 401 });

        //check if passwords match
        const passwordsMatch = await compare(password, savedUser.password);
        if (!passwordsMatch) return NextResponse.json({ errorCode: "INCORRECT_PASSWORD" }, { status: 401 });

        // generate JWT
        const authToken = generateJWT(savedUser._id, savedUser.userType);

        // return token in cookies
        const response = NextResponse.json({ success: true }, { status: 200 });
        response.cookies.set("AuthToken", authToken, {
            httpOnly: true,      // Prevents access to the cookie via JavaScript (protects against XSS)
            secure: process.env.NODE_ENV === "production",       // Ensures the cookie is only sent over HTTPS in prod
            sameSite: "strict",    // Allows login from different browsers while preventing CSRF
            path: "/",          //  Ensures the cookie is available for the entire domain
        });
        return response;
    } catch (error) {
        console.error(error);
        return NextResponse.json({ errorCode: "SERVER_ERROR" }, { status: 500 });
    }
}