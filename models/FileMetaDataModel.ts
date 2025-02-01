import mongoose from "mongoose";
import { FilesMetaDataDocument } from "@/models/app-interfaces";

const filemetadataSchema = new mongoose.Schema<FilesMetaDataDocument>({
    name: {
        type: String,
        required: [true, "Please provide a file name"],
    },
    type: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    uploadDate: {
        type: String,
        required: true
    },
    promptsUsed: {
        type: Number,
        default: 0
    },
    chat: [
        {
            role: {
                type: String,
                required: true,
                enum: ["user", "assistant"]
            },
            content: {
                type: String,
                required: true,
            },
            _id: false// Disable automatic _id generation for array elements
        }
    ]
}, { collection: "filemetadata" });

const FileMetaData = mongoose.models.filemetadata || mongoose.model<FilesMetaDataDocument>("filemetadata", filemetadataSchema);

export default FileMetaData;