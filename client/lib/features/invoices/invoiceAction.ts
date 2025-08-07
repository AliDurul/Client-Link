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
    console.log('payload:', payload);

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

    console.log(response);
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

export const deleteInvoice = async (id: any) => {
  const headers = await authConfig();
  try {
    const response = await fetch(`${BASE_URL}invoice/${id}/`, {
      method: "DELETE",
      headers,
    });
    const data = await response.json();

    if (response.status === 200) {
      return { message: data.message, remainingData: data.data };
    } else {
      throw new Error(data.detail ?? "Something went wrong, Please try again!");
    }

  } catch (error: any) {
    return { error: error.message };
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

export const readInvoice = async (id: string) => {
  const headers = await authConfig();

  try {
    const response = await fetch(`${BASE_URL}invoice/${id}/`, {
      headers,
    });

    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      throw new Error(data.detail || "Something went wrong, Please try again!");
    }

  } catch (error: any) {
    return { error: error.message };
  }

}

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

export const createInvoice = async (saleData: any) => {
  const headers = await authConfig();

  try {
    const response = await fetch(`${BASE_URL}invoices/`, {
      method: "POST",
      headers,
      body: JSON.stringify(saleData),
    });

    const data = await response.json();

    if (response.ok) {
      return { message: "Successfully Created!" };
    } else {
      throw new Error(
        data.message || "Something went wrong, Please try again!"
      );
    }
  } catch (error: any) {
    return { error: error.message };
  }
};
export const updateOrder = async (orderId: string, updateOrderBody: object) => {
  const headers = await authConfig();
  try {
    const response = await fetch(`${BASE_URL}/sales/update-order/${orderId}`, {
      method: "POST",
      headers,
      body: JSON.stringify(updateOrderBody),
    });

    const data = await response.json();
    if (response.ok) {
      if (!data.isError) {
        return { message: data.data };
      } else {
        return { message: "Something went wrong, Please try again!" };
      }
    } else {
      throw new Error(
        data.message || "Something went wrong, Please try again!"
      );
    }
  } catch (error: any) {
    return { error: error.message };
  }
};



