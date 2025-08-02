"use server";
import { auth } from "@/auth"
import { Kyc } from "@/types";

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
    console.log(data);
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

export const updateKyc = async (kycData: any) => {
  const headers = await authConfigFormData();
  const id = kycData.get("id");

  try {
    const response = await fetch(`${BASE_URL}user/${id}/`, {
      method: "PUT",
      headers,
      body: kycData,
    });

    const data = await response.json();

    if (response.ok) {
      return { message: "Successfully Updated!" };
    } else {
      throw new Error(data.error || "Something went wrong, Please try again!");
    }

  } catch (error: any) {
    return { error: error.message };
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