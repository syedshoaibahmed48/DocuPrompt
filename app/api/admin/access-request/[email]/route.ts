import { deleteStandardAccessRequest, getStandardAccessRequestByEmail } from "@/lib/mongodbClient";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, { params }: { params: { email : string }}){
    try {
        const  { email } = params;
        const existingRequest = await getStandardAccessRequestByEmail(email);
        if(existingRequest) await deleteStandardAccessRequest(email);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ errorCode: "SERVER_ERROR" }, { status: 500 });
    }
}