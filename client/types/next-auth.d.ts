import { JwtPayload } from "jwt-decode";
import NextAuth from "next-auth";

declare module "next-auth" {

    interface Session {
        access: string;
        refresh: string;
        expireAt: string;
        error?: string;
        user: userInfo;
    }
    interface User {
        error: boolean;
        access: string;
        refresh: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        access: string;
        refresh: string;
        error?: string;
        userInfo: userInfo;
        iat: number;
        exp: number;
        jti: string;
    }
}


export interface userInfo {

    id: number;
    email: string;
    phone: string | null;
    first_name: string;
    last_name: string;
    dob: string | null;
    profile_pic: string | null
    user_type: string;
    isVerified: boolean;
    [key: string]: any;
    iat: number;
    exp: number;
    jti: string;
    token_type: string;

};

export type TCredentials = {
    email: string;
    password: string;
    fullname: string;
    callbackUrl: string;
};


