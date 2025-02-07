import { LLMChatMessage } from "@/models/app-interfaces";
import FileMetaData from "@/models/FileMetaDataModel";
import StandardAccessRequest from "@/models/StandardAccessRequest";
import User from "@/models/UserModel";
import mongoose from "mongoose";

type MongoDBFunction<T extends unknown[], R> = (...args: T) => Promise<R>;

function withMongoDBConnection<T extends unknown[], R>(fn: MongoDBFunction<T, R>) {
    return async function (this: unknown, ...args: T): Promise<R> {
        if (mongoose.connection.readyState !== 1) {
            try {
                await mongoose.connect(process.env.MONGODB_CONNECT_STR!);
                const connection = mongoose.connection;
                connection.on('error', (error) => {
                    console.error("MongoDB connection error", error);
                });
            } catch (error) {
                console.error("Couldn't connect to MongoDB", error);
            }
        }
        return fn.apply(this, args);
    };
}

export const saveNewUser = withMongoDBConnection(async function saveNewUser(userName: string, email: string, password: string, userType: string) {
    const newUser = new User({
        userName,
        email,
        password,
        userType
    });
    return await newUser.save();
});

export const getAllUsers = withMongoDBConnection(async function getAllUsers() {
    return await User.aggregate([
        {
            $lookup: {
                from: "filemetadata", // Ensure this matches your collection name
                let: { userId: { $toString: "$_id" } }, // Convert _id to string
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$userId", "$$userId"] } // Match userId with _id
                        }
                    }
                ],
                as: "files"
            }
        },
        {
            $addFields: {
                filesUploaded: { $size: "$files" },
                promptsUsed: { $sum: "$files.promptsUsed" },
                storageUsed: { $sum: "$files.size" }
            }
        },
        {
            $project: {
                _id: 0,
                userName: 1,
                userType: 1,
                email: 1,
                filesUploaded: 1,
                promptsUsed: 1,
                storageUsed: 1
            }
        }
    ]);
});

export const getUsersAggregatedByType = withMongoDBConnection(async function getUsersAggregatedByType() {
    return await User.aggregate([
        {
            $group: {
                _id: '$userType',
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                userType: '$_id',
                count: 1
            }
        }
    ]);
})

export const getUserById = withMongoDBConnection(async function getUserById(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    return {
        userName: user.userName,
        email: user.email,
        userType: user.userType
    };
});

export const getUserByNameOrEmail = withMongoDBConnection(async function getUserByNameOrEmail(userNameOrEmail: string) {
    return await User.findOne({ $or: [{ userName: userNameOrEmail }, { email: userNameOrEmail }] });
});

export const getUserType = withMongoDBConnection(async function getUserType(userId: string): Promise<string> {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    return user.userType;
});

export const getUserFilesData = withMongoDBConnection(async function getUserFilesData(userId: string) {
    const userFiles = await FileMetaData.aggregate([
        { $match: { userId } }, // Filter files by userId
        {
            $group: {
                _id: null,
                filesUploaded: { $sum: 1 }, // Count the number of files
                storageUsed: { $sum: "$size" }, // Sum the size of the files
                promptsUsed: { $sum: "$promptsUsed" },
                files: {
                    $push: {
                        // Store file metadata in an array
                        fileId: "$_id",
                        name: "$name",
                        type: "$type",
                        size: "$size",
                        uploadDate: "$uploadDate",
                    },
                },
            },
        },
        {
            $project: {
                files: 1,
                filesUploaded: 1,
                storageUsed: 1,
                promptsUsed: 1
            },
        },
    ]).exec();

    if (!userFiles.length) {
        return { files: [], filesUploaded: 0, storageUsed: 0, promptsUsed: 0 };
    }

    return userFiles[0]
});

export const getTotalPromptsUsedByUser = withMongoDBConnection(async function getTotalPromptsUsedByUser(userId: string) {
    const sumTotalPromptsUsed = await FileMetaData.aggregate([
        { $match: { userId } }, // Filter files by userId
        {
            $group: {
                _id: null,
                totalPromptsUsed: { $sum: "$promptsUsed" },
            },
        }
    ]);

    return sumTotalPromptsUsed[0].totalPromptsUsed;
})

export const saveFile = withMongoDBConnection(async function saveFile(userId: string, name: string, type: string, size: number, uploadDate: string) {
    const newFile = new FileMetaData({
        userId,
        name,
        type,
        size,
        uploadDate,
    });
    return await newFile.save();
});

export const getFileById = withMongoDBConnection(async function getFileById(fileId: string) {
    return await FileMetaData.findById(fileId);
});

export const getAllDemoUserFiles = withMongoDBConnection(async function getAllDemoUserFiles() {
    return await FileMetaData.aggregate([
        {
          $addFields: {
            userIdAsObjectId: { $toObjectId: "$userId" }
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "userIdAsObjectId",
            foreignField: "_id",
            as: "user"
          }
        },
        {
          $unwind: "$user"
        },
        {
          $match: {
            "user.userType": "demo" // Only users with type "demo"
          }
        },
        {
          $project: {
            _id: 0,         // Exclude MongoDB's default _id field
            fileId: "$_id", // Rename _id to fileId
            filename: "$name",         // Keep file name
            userId: 1
          }
        }
      ]);      
})

export const resetPromptsUsed = withMongoDBConnection(async function resetPromptsUsed() {
    return await FileMetaData.updateMany({}, { $set: { promptsUsed: 0 } })
})

export const deleteFileById = withMongoDBConnection(async function deleteFileById(fileId: string) {
    try {
        return await FileMetaData.findByIdAndDelete(fileId);
    } catch (error) {
        console.error(`Error deleting file by id: ${fileId}`, error);
    }
});

export const deleteFileMetaDatas = withMongoDBConnection(async function deleteFiles(fileIds: string[]) {
    for (const fileId of fileIds) {
        try {
            await FileMetaData.findByIdAndDelete(fileId);
        } catch (error) {
            console.error(`Error deleting file by id: ${fileId}`, error);
        }
    }
})

export const updateChat = withMongoDBConnection(async function updateChat(fileId: string, chat: LLMChatMessage[]) {
    return await FileMetaData.findByIdAndUpdate(fileId, { $set: { chat }, $inc: { promptsUsed: 1 } });
});

export const getAllStandardAccessRequests = withMongoDBConnection(async function getAllStandardAccessRequests() {
    return await StandardAccessRequest.find({}, { _id: 0, name: 1, email: 1, comments: 1 });
})

export const getStandardAccessRequestByEmail = withMongoDBConnection(async function getStandardAccessRequestByEmail(email: string) {
    return await StandardAccessRequest.findOne({ email });
});

export const saveStandardAccessRequest = withMongoDBConnection(async function saveStandardAccessRequest(name: string, email: string, comments: string) {
    const newRequest = new StandardAccessRequest({
        name,
        email,
        comments
    });
    return await newRequest.save();
});

export const deleteStandardAccessRequest = withMongoDBConnection(async function deleteStandardAccessRequestByEmail(email: string) {
    return await StandardAccessRequest.findOneAndDelete({ email });
});