import { NextRequest, NextResponse } from "next/server";
import { getStandardAccessRequestByEmail, saveStandardAccessRequest } from "@/lib/mongodbClient";

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json();
        const { name, email, comments } = reqBody;
        
        const existingUser = await getStandardAccessRequestByEmail(email);
        if(existingUser){
            return NextResponse.json({ errorCode: "TOO_MANY_REQUESTS" }, { status: 429 });
        }
        await saveStandardAccessRequest(name, email, comments);

        return NextResponse.json({ success: true }, { status: 200 });        
    } catch (error) {
        console.error(error);
        return NextResponse.json({ errorCode: "SERVER_ERROR" }, { status: 500 });
    }
}