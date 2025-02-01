import { NextRequest, NextResponse } from "next/server";
import limits from "@/assets/json/user_limits.json";
import { getUserById, getUserFilesData } from "@/lib/mongodbClient";

export async function GET(request: NextRequest) {
  try {
    //get userId from request headers
    const userId = request.headers.get("user-id");

    //get userdetails, files from db
    const user = await getUserById(userId!);
    if (!user) {
      return NextResponse.json({ errorCode: "USER_NOT_FOUND" }, { status: 404 });
    }

    //get user details
    const { userType } = user;

    const UserFiles = await getUserFilesData(userId!);
    const { files, filesUploaded, storageUsed, promptsUsed } = UserFiles;

    //get user limits
    const usageLimit = limits.usageLimits[userType as keyof typeof limits.usageLimits];

    //return details to user
    return NextResponse.json(
      {
        userType,
        usageStats: {
          ...usageLimit,
          filesUploaded,
          promptsUsed,
          storageUsed,
        },
        files,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ errorCode: "SERVER_ERROR" }, { status: 500 });
  }
}
