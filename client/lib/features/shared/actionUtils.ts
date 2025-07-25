'use server';
import { auth } from "@/auth";
import qs from 'query-string'


const BASE_URL = process.env.API_BASE_URL + '/';


export const authConfig = async () => {
    const session = await auth();
    const accessToken = session?.access;

    return {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
    };
};

interface GetAllDataParams {
    url: string;
    searchQueries?: Record<string, string | undefined>;
    filterQueries?: Record<string, string | undefined>;
    customQuery?: Record<string, string | undefined>;
}

export const getAllData = async ({ url, searchQueries, customQuery, filterQueries }: GetAllDataParams) => {
    const headers = await authConfig();

    // await new Promise(resolve => setTimeout(resolve, 3000));

    // Build query object
    const queryObject: Record<string, string> = {};

    // Handle searchQueries with bracket notation
    if (searchQueries) {
        Object.entries(searchQueries)
            .filter(([, value]) => value !== undefined && value !== '')
            .forEach(([key, value]) => {
                queryObject[`search[${key}]`] = value as string;
            });
    }
    // Handle filterQueries with bracket notation
    if (filterQueries) {
        Object.entries(filterQueries)
            .filter(([, value]) => value !== undefined && value !== '')
            .forEach(([key, value]) => {
                queryObject[`filter[${key}]`] = value as string;
            });
    }

    // Handle customQuery as normal parameters
    if (customQuery) {
        Object.entries(customQuery)
            .filter(([, value]) => value !== undefined && value !== '')
            .forEach(([key, value]) => {
                queryObject[key] = value as string;
            });
    }

    // Use query-string to build the URL with proper encoding options
    const finalUrl = qs.stringifyUrl(
        {
            url: BASE_URL + url,
            query: queryObject
        },
        {
            encode: false,          // Don't encode square brackets
            skipNull: true,         // Skip null values
            skipEmptyString: true   // Skip empty strings
        }
    );

    // console.log('Query Object:', queryObject);
    // console.log('Final URL:', finalUrl);

    try {
        const response = await fetch(finalUrl, {
            headers,
            next: { tags: [url] }
        });

        const data = await response.json();

        if (!response.ok && !data.success) throw new Error(data.message || "Something went wrong, Please try again!");

        return data

    } catch (error: any) {
        return { error: error.message };
    }
};