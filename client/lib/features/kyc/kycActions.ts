"use server";
import { auth } from "@/auth"
import { customerSchema } from "@/lib/utility/zod";
import { Kyc } from "@/types";
import { revalidateTag } from "next/cache";
import { authConfig } from "../shared/actionUtils";

const BASE_URL = process.env.API_BASE_URL + '/';


const authConfigFormData = async () => {
  const session = await auth();
  const accessToken = session?.access;

  return {
    Authorization: `Bearer ${accessToken}`,
  };
}


export const kycCrUpAction = async (_: unknown, payload: FormData) => {

  const id = payload.get('_id') as string;
  payload.delete('_id');

  console.log('id:', !!id);

  const rowData = {
    first_name: payload.get('first_name') as string,
    last_name: payload.get('last_name') as string,
    profession: payload.get('profession') as string | null,
    dob: payload.get('dob') as string,
    email: payload.get('email') as string,
    phone_number: payload.get('phone_number') as string,
    gender: payload.get('gender') as string,
    id_type: payload.get('id_type') as string,
    id_number: payload.get('id_number') as string,
    religion: payload.get('religion') as string,
    marital_status: payload.get('marital_status') as string,
    boys: payload.get('boys') as string | number | null,
    girls: payload.get('girls') as string | number | null,
    street: payload.get('street') as string | null,
    city: payload.get('city') as string | null,
    state: payload.get('state') as string | null,
    country: payload.get('country') as string | null,
    zip_code: payload.get('zip_code') as string | null,
    father_name: payload.get('father_name') as string | null,
    mother_name: payload.get('mother_name') as string | null,
    witness_name: payload.get('witness_name') as string | null,
    witness_relation: payload.get('witness_relation') as string | null,
    nationality: payload.get('nationality') as string,
    finincial_institution: payload.get('finincial_institution') as string | null,
    medication: payload.get('medication') === 'true' ? true : false,
    medication_type: payload.get('medication_type') as string | null,
    profile_pic: payload.get('profile_pic') ?? null,
  }

  const result = customerSchema.safeParse(rowData);


  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { success: false, message: 'Fix the error in the form', inputs: rowData, errors };
  }

  const url = !!id ? `${BASE_URL}customers/${id}/` : `${BASE_URL}customers/`;
  const method = !!id ? "PUT" : "POST";

  try {
    const headers = await authConfigFormData();

    const response = await fetch(url, {
      method,
      headers,
      body: payload,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong, Please try again!");
    }


    revalidateTag('customers');
    return {
      message: !!id ? "Task updated successfully!" : "Task created successfully!",
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


export const getKyc = async (id: string | null): Promise<{ result?: Kyc, success: boolean, message?: string }> => {

  // await new Promise(resolve => setTimeout(resolve, 2000));

  try {
    const headers = await authConfig();
    const response = await fetch(`${BASE_URL}customers/${id}/`, { headers });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong, Please try again!");
    }

    return data;
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong, Please try again!" };
  }
};


export const delKyc = async (id: number) => {
  try {
    const headers = await authConfig();
    const response = await fetch(`${BASE_URL}customers/${id}/`, {
      method: "DELETE",
      headers,
    });

    const res = await response.json();
    console.log('delete response:', res);

    if (!res.success && response.status !== 204) {
      throw new Error(res.message || "Something went wrong, Please try again!");
    }

    revalidateTag('customers');
    return { success: true, message: "Customer deleted successfully" };

  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong, Please try again!" };
  }
};


export const delMultiKyc = async (ids: number[]) => {

  if (ids.length === 0) return { success: false, message: "No customers selected for deletion" };

  try {
    const headers = await authConfig();
    const response = await fetch(`${BASE_URL}customers`, {
      method: "DELETE",
      headers,
      body: JSON.stringify({ ids }),
    });

    const res = await response.json();

    if (!res.success && response.status !== 204) {
      throw new Error(res.message || "Something went wrong, Please try again!");
    }

    revalidateTag('customers');
    return { success: true, message: "Customers deleted successfully" };

  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong, Please try again!" };

  }
};

