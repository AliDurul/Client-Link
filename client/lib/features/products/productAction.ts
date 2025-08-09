"use server";
import { authConfig } from "../shared/actionUtils";
import { productSchema } from "@/lib/utility/zod";
import { revalidateTag } from "next/cache";

const BASE_URL = process.env.API_BASE_URL + '/'




export const productCrUpAction = async (_: unknown, payload: FormData) => {

    const id = payload.get('id') as string;

    const rowData = {
        name: payload.get('name') || "",
        price: Number(payload.get('price')) || 0,
        description: payload.get('description') || "",
        is_active: payload.get('is_active') || true,
        // category: payload.get('category') || "",
        // stock_quantity: Number(payload.get('stock_quantity')) || 0,
    };
    console.log('rowData:', rowData);
    const result = productSchema.safeParse(rowData);

    if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        return { success: false, message: 'Fix the error in the form', inputs: rowData, errors };
    }

    const url = id ? `${BASE_URL}products/${id}/` : `${BASE_URL}products/`;
    const method = id ? "PUT" : "POST";

    try {
        const headers = await authConfig();

        const response = await fetch(url, {
            method,
            headers,
            body: JSON.stringify(result.data),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Something went wrong, Please try again!");
        }

        revalidateTag('products');
        return { message: "Successfully Updated!", success: true };

    } catch (error: any) {
        return { message: error.message, success: false, inputs: result.data };
    }
};
