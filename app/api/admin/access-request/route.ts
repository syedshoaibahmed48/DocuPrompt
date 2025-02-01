import { deleteStandardAccessRequest, getStandardAccessRequestByEmail, getUserByNameOrEmail, saveNewUser } from "@/lib/mongodbClient";
import { genSalt, hash } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { userName, email, password } = await request.json();

        //check if user with this username or email already exists
        const existingUser = await getUserByNameOrEmail(userName) || await getUserByNameOrEmail(email);
        if (existingUser) {
            if (existingUser.userName === userName) return NextResponse.json({ errorCode: "USERNAME_ALREADY_EXISTS" }, { status: 400 });
            else return NextResponse.json({ errorCode: "EMAIL_ALREADY_EXISTS" }, { status: 400 });
        }

        //hash password
        const salt = await genSalt(7);
        const hashedPassword = await hash(password, salt);

        //Save new user
        await saveNewUser(userName, email, hashedPassword, "standard");

        //check if request exists, if yes then delete it from db
        const existingRequest = await getStandardAccessRequestByEmail(email);
        if(existingRequest) await deleteStandardAccessRequest(email);

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ errorCode: "SERVER_ERROR" }, { status: 500 });
    }
}