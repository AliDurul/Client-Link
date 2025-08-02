"use server";
import { auth } from "@/auth"
import { customerSchema } from "@/lib/utility/zod";
import { Kyc } from "@/types";
import { revalidateTag } from "next/cache";

const BASE_URL = process.env.API_BASE_URL + '/';

const authConfig = async () => {
  const session = await auth();
  const accessToken = session?.access;

  return {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
};

const authConfigFormData = async () => {
  const session = await auth();
  const accessToken = session?.access;

  return {
    Authorization: `Bearer ${accessToken}`,
    // "Content-Type": "multipart/form-data",
  };
}

export const getAllKycs = async (type?: string, page?: string, pageSize?: string, search?: string) => {
  const headers = await authConfig();
  let url = `${BASE_URL}users/`;

  const params = new URLSearchParams();
  if (type) params.append("user_type", type);
  if (page) params.append("page", page);
  if (pageSize) params.append("page_size", pageSize);
  if (search) params.append("search", search)

  if (params.toString()) url += `?${params.toString()}`;


  try {
    const response = await fetch(url, {
      headers,
    });

    const data = await response.json();


    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error || "Something went wrong, Please try again!");
    }
  } catch (error: any) {
    return { error: error.message };
  }
};

export const readKyc = async (id: string | null): Promise<{ result?: Kyc, success: boolean, message?: string }> => {

  await new Promise(resolve => setTimeout(resolve, 2000));

  const headers = await authConfig();
  try {
    const response = await fetch(`${BASE_URL}customers/${id}/`, {
      headers,
    });

    const data = await response.json();
    console.log('read workd');

    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error || "Something went wrong, Please try again!");
    }
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong, Please try again!" };
  }
};

export const deleteKyc = async (id: any) => {
  const headers = await authConfig();
  try {
    const response = await fetch(`${BASE_URL}user/${id}/`, {
      method: "DELETE",
      headers,
    });

    const data = await response.json();

    if (response.status === 200) {
      return { message: data.message, remainingData: data.data };
    } else {
      throw new Error(data.error ?? "Something went wrong, Please try again!");
    }

  } catch (error: any) {
    return { error: error.message };
  }
};

export const deleteMultiKyc = async (ids: any) => {
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
      throw new Error(data.error ?? "Something went wrong, Please try again!");
    }

  } catch (error: any) {
    return { error: error.message };
  }
};

export const updateKyc = async (_: unknown, payload: FormData) => {

  const id = payload.get('_id') as string;

  const address = {
    street: payload.get('street') as string | null,
    city: payload.get('city') as string | null,
    state: payload.get('state') as string | null,
    country: payload.get('country') as string | null,
    zip_code: payload.get('zip_code') as string | null,
  };

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

  const url = id ? `${BASE_URL}customers/${id}/` : `${BASE_URL}customers/`;
  const method = id ? "PUT" : "POST";

  try {
    const headers = await authConfigFormData();

    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(result.data),
    });

    const data = await response.json();
    // console.log(data);

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong, Please try again!");
    }

    revalidateTag('customers');
    return { message: "Successfully Updated!", success: true };

  } catch (error: any) {
    return { message: error.message, success: false, inputs: result.data };
  }
};

export const createKyc = async (kycData: any) => {
  const headers = await authConfigFormData();

  try {

    const response = await fetch(`${BASE_URL}users/`, {
      method: "POST",
      headers,
      body: kycData,
    });

    const data = await response.json();

    if (response.ok) {
      return data
    } else {
      throw new Error(data.error || "Something went wrong, Please try again!");
    }

  } catch (error: any) {
    return { error: error.message };
  }

};