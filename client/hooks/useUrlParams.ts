import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useRef } from 'react';

export const useUrlParams = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const updateUrlParams = useCallback((updates: Record<string, string | null>, options: { debounce?: number; replace?: boolean } = {}) => {
        const { debounce = 0, replace = false } = options;

        const performUpdate = () => {
            try {
                const urlParams = new URLSearchParams(searchParams.toString());

                Object.entries(updates).forEach(([key, value]) => {
                    if (value === null || value === '') {
                        urlParams.delete(key);
                    } else {
                        urlParams.set(key, value);
                    }
                });

                const newUrl = `${window.location.pathname}?${urlParams.toString()}`;

                if (replace) {
                    router.replace(newUrl, { scroll: false });
                } else {
                    router.push(newUrl, { scroll: false });
                }
            } catch (error) {
                console.error('Failed to update URL params:', error);
            }
        };

        if (debounce > 0) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(performUpdate, debounce);
        } else {
            performUpdate();
        }
    }, [router, searchParams]);

    // Helper to get current param value
    const getParam = useCallback((key: string, defaultValue?: string) => {
        return searchParams.get(key) ?? defaultValue ?? null;
    }, [searchParams]);

    // Helper to check if param exists
    const hasParam = useCallback((key: string) => {
        return searchParams.has(key);
    }, [searchParams]);

    return {
        updateUrlParams,
        getParam,
        hasParam,
        searchParams
    };
};