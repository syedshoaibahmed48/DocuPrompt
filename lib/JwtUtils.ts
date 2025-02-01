import jwt from 'jsonwebtoken'
import { DecodedJWT } from '@/models/app-interfaces';

export function generateJWT(userId: string, userType: string){
    return jwt.sign({userId, userType}, process.env.JWT_SECRET_KEY!);
}

export function getUserDetailsfromJWT(token: string){
    const decodedToken = jwt.decode(token) as DecodedJWT;
    return decodedToken;
}