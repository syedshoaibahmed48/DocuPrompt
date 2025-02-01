import { ApiRequestPayload, LLMChatMessage } from "@/models/app-interfaces";

async function apiRequest(endpoint: string, method: string, data?: ApiRequestPayload) {
    const response = await fetch(endpoint, {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (response.ok) {
        return response.json();
    }
    else {
        const { errorCode } = await response.json();
        throw new Error(errorCode);
    }
}

export async function mulitpartApiRequest(file: File) {
    const formData = new FormData();
    formData.set('file', file);
    const response = await fetch(`/api/file`, {
        method: 'POST',
        body: formData,
    });
    if (response.ok) {
        return response.json();
    }
    else {
        const { errorCode } = await response.json();
        throw new Error(errorCode);
    }
}

export async function signin(usernameOrEmail: string, password: string) {
    return await apiRequest('/api/signin', 'POST', { usernameOrEmail, password });
}

export async function grantStandardAccess(userName: string, email: string, password: string) {
    return await apiRequest('/api/admin/access-request', 'POST', { userName, email, password });
}

export async function ignoreStandardAccessRequest(email: string) {
    return await apiRequest(`/api/admin/access-request/${email}`, 'DELETE');
}

export async function demoUserLogin(fingerprint: string) {
    return await apiRequest('/api/demo-login', 'POST', { fingerprint });
}

export async function requestStandardAccess(name: string, email: string, comments: string) {
    return await apiRequest('/api/request-access', 'POST', { name, email, comments });
}

export async function signout() {
    return await apiRequest('/api/signout', 'GET');
}

export async function getUserDetailsAndUsageStats() {
    return await apiRequest('/api/me', 'GET');
}

export async function uploadFile(file: File) {
    return await mulitpartApiRequest(file);
}

export async function deleteFile(fileId: string) {
    return await apiRequest(`/api/file/${fileId}`, 'DELETE')
}

export async function getFileDataAndChat(fileId: string) {
    return await apiRequest(`/api/file/${fileId}`, 'GET');
}

export async function sendChat(fileId: string, chat: LLMChatMessage[]) {
    return await apiRequest(`/api/chat`, 'POST', { fileId, chat });
}

export async function getAllData() {
    return await apiRequest('/api/admin/all-data', 'GET');
}