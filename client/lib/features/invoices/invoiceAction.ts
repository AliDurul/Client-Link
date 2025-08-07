"use server";
import { auth } from "@/auth";
import { Invoice, Kyc } from "@/types";
import { authConfig } from "../shared/actionUtils";
import { revalidateTag } from "next/cache";
import { invoiceSchema } from "@/lib/utility/zod";

const BASE_URL = process.env.API_BASE_URL + '/'



export const InvoiceCrUpAction = async (_: unknown, payload: any) => {

  const id = payload._id;
  delete payload._id;

  const result = invoiceSchema.safeParse(payload);


  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { success: false, message: 'Fix the error in the form', inputs: payload, errors };
  }

  const url = !!id ? `${BASE_URL}invoices/${id}/` : `${BASE_URL}invoices/`;
  const method = !!id ? "PUT" : "POST";

  try {
    const headers = await authConfig();

    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong, Please try again!");
    }

    revalidateTag('invoices');
    return {
      message: !!id ? "Invoice updated successfully!" : "Invoice created successfully!",
      success: true
    };

  } catch (error: any) {
    return {
      message: error.message || "Something went wrong, Please try again!",
      success: false,
      inputs: result.data
    };
  }
};


export const deleteMultiInvoice = async (ids: any) => {
  const headers = await authConfig();

  try {
    const response = await fetch(`${BASE_URL}/sales/multiple-delete`, {
      method: "POST",
      headers,
      body: JSON.stringify({ ids }),
    });

    const data = await response.json();

    if (!data.error && response.status === 202) {
      return { message: data.message, remainingData: data.data };
    } else {
      throw new Error(data.message ?? "Something went wrong, Please try again!");
    }

  } catch (error: any) {
    return { error: error.message };
  }
};


export const getWeeklyInvoice = async (startDate: string, endDate: string) => {
  const headers = await authConfig();

  try {
    const response = await fetch(`${BASE_URL}/sales/w?startDate=${startDate}&endDate=${endDate}`, {
      headers,
    });

    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || "Something went wrong, Please try again!");
    }

  } catch (error: any) {
    return { error: error.message };
  }

}
