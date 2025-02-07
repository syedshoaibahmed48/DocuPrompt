import { Document } from "mongoose";

export interface UserAuthData {
  userName: string;
  email?: string;
  password: string;
}

export interface AuthFormData {
  signinUsername?: string;
  signinPassword?: string;
  signupUsername?: string;
  signupEmail?: string;
  signupPassword?: string;
  signupConfirmPassword?: string;
}

export interface AuthFormValidationErrors {
  signupUsername: boolean;
  signupEmail: boolean;
  signupPassword: boolean;
  signupConfirmPassword: boolean;
}

export interface UserDocument extends Document {
  userName: string;
  email?: string;
  password?: string;
  userType: string;
}

export interface UsersList {
  userName: string;
  email: string;
  userType: string;
  filesUploaded?: number;
  promptsUsed?: number;
  storageUsed?: number;
}

export interface UsersAggregatedByType {
  userType: string;
  count: number;
}

export interface FirebaseUsageStats {
  storageUsed: number;
  storageLimit: number;
}

export interface PineconeUsageStats {
  totalRecordCount: number;
  namespacesCount: number;
}

export interface DecodedJWT {
  userId: string;
  userName: string;
  userType: string;
  iat: number;
}

export interface UserSignUpValidationResult {
  isValid: boolean;
  message?: string;
}

export interface FilesMetaDataDocument extends Document {
  name: string;
  path: string;
  type: string;
  size: number;
  userId: string;
  uploadDate: string;
  promptsUsed: number;
  chat: LLMChatMessage[];
}

export interface StandardAccessRequest extends Document {
  name: string;
  email: string;
  comments: string;
}

export interface FileMetaData {
  fileId?: string;
  name: string;
  size?: number;
  type?: string;
  uploadDate?: string;
  promptsUsed?: number;
  maxPrompts?: number;
  fileContent?: string;
  chat?: LLMChatMessage[]
}

export interface FileDetails {
  userId: string;
  filename: string;
}

export interface UserFiles {
  files: FileMetaData[];
  filesUploaded: number;
  storageUsed: number;
  promptsUsed: number;
}

export interface UsageStats {
  maxFiles: number;
  filesUploaded?: number;
  maxPrompts: number;
  promptsUsed?: number;
  maxStorage: number;
  storageUsed?: number;
}

export interface TextChunk {
  pageContent: string;
  metadata: {
    loc: {
      lines: {
        from: number;
        to: number;
      };
    };
    fileId: string;
  };
  id?: string;
}

export interface LLMChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface Chat {
  chat: LLMChatMessage[];
}

export interface ApiRequestPayload {
  usernameOrEmail?: string;
  password?: string;
  userName?: string;
  email?: string;
  fingerprint?: string;
  name?: string;
  comments?: string;
  fileId?: string;
  chat?: LLMChatMessage[];
}

export interface MongoDBCrudArgs {
  userName?: string;
  email?: string;
  password?: string;
  userType?: string;
  userId?: string;
  userNameOrEmail?: string;
  fileId?: string;
  name?: string;
  type?: string;
  size?: number;
  uploadDate?: string;
  chat?: LLMChatMessage[];
  comments?: string;
}