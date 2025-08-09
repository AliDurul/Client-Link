'use server';
import { cachedAuth } from "@/lib/utility/functions";
import { revalidateTag } from "next/cache";
import qs from 'query-string'


const BASE_URL = process.env.API_BASE_URL + '/';
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authConfig = async () => {

    const session = await cachedAuth();

    if (!session?.access) {
        throw new Error("You are not authenticated, Please login again!");
    }

    return {
        Authorization: `Bearer ${session?.access}`,
        "Content-Type": "application/json",
    };
};

export const getData = async (url: string) => {

    // await wait(5000);

    try {
        const headers = await authConfig();
        const response = await fetch(BASE_URL + url, { headers });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Something went wrong, Please try again!");
        }

        return data;
    } catch (error: any) {
        return { success: false, message: error.message || "Something went wrong, Please try again!" };
    }
};

export const delData = async (_: unknown, { url, id }: { url: string; id: string }) => {
    try {
        const headers = await authConfig();
        const response = await fetch(`${BASE_URL}${url}/${id}/`, {
            method: "DELETE",
            headers,
        });


        if (response.status !== 204) {
            const res = await response.json();
            throw new Error(res.message || "Something went wrong, Please try again!");
        }

        revalidateTag(url);
        return { success: true, message: `Data deleted successfully` };

    } catch (error: any) {
        return { success: false, message: error.message || "Something went wrong, Please try again!" };
    }
};

export const delMultiData = async (_: unknown, { url, ids }: { url: string; ids: string[] }) => {

    if (ids.length === 0) return { success: false, message: "No customers selected for deletion" };

    try {
        const headers = await authConfig();
        const response = await fetch(`${BASE_URL}${url}`, {
            method: "DELETE",
            headers,
            body: JSON.stringify({ ids }),
        });


        if (response.status !== 204) {
            const res = await response.json();
            throw new Error(res.message || "Something went wrong, Please try again!");
        }

        revalidateTag('customers');
        return { success: true, message: "Datas deleted successfully" };

    } catch (error: any) {
        return { success: false, message: error.message || "Something went wrong, Please try again!" };

    }
};

interface GetAllDataParams extends QueryParams { url: string; }

export const getAllData = async ({ url, searchQueries, customQuery, filterQueries, sortQueries }: GetAllDataParams) => {

    if (!url) return { success: false, error: 'URL parameter is required' };

    //    await wait(5000);

    const queryObject = buildQueryParams({
        searchQueries,
        filterQueries,
        sortQueries,
        customQuery
    });

    const finalUrl = qs.stringifyUrl(
        {
            url: BASE_URL + url,
            query: queryObject
        },
        {
            encode: false,
            skipNull: true,
            skipEmptyString: true,
            arrayFormat: 'bracket'
        }
    );

    console.log('Final URL:', finalUrl);

    try {
        const headers = await authConfig();

        const response = await fetch(finalUrl, {
            headers,
            next: { tags: [url] }
        });

        const data = await response.json();

        if (!response.ok && !data.success) throw new Error(data.message || "Something went wrong, Please try again!");

        return data

    } catch (error: any) {
        // throw new Error(error.message || "Something went wrong, Please try again!");
        return { error: error.message };
    }
};

interface QueryParams {
    searchQueries?: Record<string, string | undefined>;
    filterQueries?: Record<string, string | undefined>;
    sortQueries?: Record<string, string | undefined>;
    customQuery?: Record<string, string | number | boolean | undefined>;
}

// Utility  clean and build query parameters
const buildQueryParams = (params: QueryParams): Record<string, string> => {
    const queryObject: Record<string, string> = {};

    // Helper function to process query entries
    const processEntries = (
        entries: Record<string, any> | undefined,
        prefix?: string
    ) => {
        if (!entries) return;

        Object.entries(entries)
            .filter(([, value]) => value !== undefined && value !== '' && value !== null)
            .forEach(([key, value]) => {
                const finalKey = prefix ? `${prefix}[${key}]` : key;
                queryObject[finalKey] = String(value);
            });
    };

    // Process different query types
    processEntries(params.searchQueries, 'search');
    processEntries(params.filterQueries, 'filter');
    processEntries(params.sortQueries, 'sort');
    processEntries(params.customQuery);

    return queryObject;
};