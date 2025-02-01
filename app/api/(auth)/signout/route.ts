import { NextResponse } from "next/server";

export async function GET() {
    try {
        // return token in cookies
        const response = NextResponse.json({ success: true }, { status: 200 });
        response.cookies.set("AuthToken", "", { httpOnly: true });
        return response;
    } catch (error) {
        console.error(error);
        return NextResponse.json({ errorCode: "SERVER_ERROR" }, { status: 500 });
    }
}