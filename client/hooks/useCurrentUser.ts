import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
    const { data: session } = useSession();
    const userInfo = session?.user
    const accessToken = session?.access;
    const refreshToken = session?.refresh;

    return { userInfo, accessToken, refreshToken };
}