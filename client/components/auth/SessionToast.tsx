"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { coloredToast } from "@/lib/utility/sweetAlerts";

export function SessionToast() {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const sessionExpired = searchParams.get("session_expired");
        if (sessionExpired === "true") {
            coloredToast('danger', "Session expired. Please log in again")

            // Clean up the URL parameter
            const url = new URL(window.location.href);
            url.searchParams.delete("session_expired");
            router.replace(url.pathname + url.search, { scroll: false });
        }
    }, [searchParams, router]);

    return null;
}