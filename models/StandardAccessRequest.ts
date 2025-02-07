import mongoose from "mongoose"
import type { StandardAccessRequest } from "./app-interfaces"

const standardAccessRequestSchema = new mongoose.Schema<StandardAccessRequest>({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    comments: {
        type: String
    }
}, { collection: "standardaccessrequest", timestamps: true });

const StandardAccessRequest = mongoose.models.standardaccessrequest || mongoose.model<StandardAccessRequest>("standardaccessrequest", standardAccessRequestSchema);

export default StandardAccessRequest;