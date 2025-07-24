"use server";

import { credentialsSchema } from "@/lib/utility/zod";
import { redirect } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/utility/routes";
import { signIn } from "@/auth";
import { Account, AuthError, CredentialsSignin, Profile } from "next-auth";
import { userInfo } from "@/types/next-auth";
import { JWT } from "next-auth/jwt";
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = process.env.API_BASE_URL;


export const authCredentials = async (_: unknown, payload: FormData) => {


    const { email, password } = Object.fromEntries(payload.entries());
    const rowData = { email, password };

    const result = credentialsSchema.safeParse(rowData);

    if (!result.success) {

        return {
            success: false,
            message: "Please fix errors in the form.",
            errors: result.error.flatten().fieldErrors,
            inputs: rowData
        }

    }

    try {

        await signIn('credentials', {
            email: result.data.email,
            password: result.data.password,
        })

    } catch (error) {
        let errorMsg = '';
        let success = false;
        // console.log('login error', error);
        if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
            // user is already logged in and redirected
            success = true;
            redirect(DEFAULT_LOGIN_REDIRECT);
        } else if (error instanceof AuthError) {
            errorMsg = error.message;
        } else {
            errorMsg = (error as any).message;
        }

        return {
            success,
            message: errorMsg || 'Something went wrong.',
            inputs: rowData
        }
    }

};






/* Net-Auth FUtility Functions */

export const fetchWithErrorHandling = async (url: string, body: object) => {

    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        cache: 'no-store',
    });
    const data = await res.json();
    // console.log('backend res', data);
    if (!res.ok || !data.success) throw new CustomError(data.message || 'Custom Message: Authentication failed');
    return data;
};

export const refreshAccessToken = async (token: JWT) => {
    try {
        const newTokens = await fetchWithErrorHandling(`${API_BASE_URL}/auth/refresh`, { refresh: token.refresh });

        return {
            ...token,
            access: newTokens.access,
            userInfo: jwtDecode<userInfo>(newTokens.access),
            refresh: newTokens.refresh || token.refresh,
        };
    } catch (error: unknown) {
        console.error("Error: refreshing access token", (error as Error).message);
        return { ...token, error: "RefreshTokenError" };
    }
};


// Custom Errors
class CustomError extends CredentialsSignin {
    constructor(message: string) {
        super(message);
        this.message = message || "Custom Message: Authentication failed";
    }
    code = "custom_error";
}

class SignInError extends Error {
    constructor(message: string, public code: string = "signin_error") {
        super(message);
        this.name = "SignInError";
    }
}

export const registerOrFetchUser = async (account: Account, profile: Profile) => {
    let payload;
    switch (account.provider) {
        case 'google':
            const { sub, email, name, picture } = profile;
            payload = { email, sub, fullname: name, picture };
            break;
        case 'github':
            const { node_id, email: ghEmail, name: ghName, avatar_url, html_url, bio } = profile;
            payload = { email: ghEmail, sub: node_id, fullname: ghName, picture: avatar_url, github_link: html_url, bio };
            break;
        default:
            throw new SignInError('Unsupported provider', 'unsupported_provider');
    }

    return fetchWithErrorHandling(`${API_BASE_URL}/auth/register`, payload);
};
