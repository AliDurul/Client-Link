"use server";
import { auth } from "@/auth";

const BASE_URL = process.env.NEXT_PUBLIC_APIBASE_URL + '/'

const authConfig = async () => {
  const session = await auth();
  const accessToken = session?.accessToken;

  return {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
};

export const getAllLeads = async (page?: string, pageSize?: string, search?: string) => {
  const headers = await authConfig();

  let url = `${BASE_URL}leads/`;

  const params = new URLSearchParams();
  if (page) params.append("page", page);
  if (pageSize) params.append("page_size", pageSize);
  if (search) params.append("search", search)

  if (params.toString()) url += `?${params.toString()}`;

  try {
    const response = await fetch(url, {
      // cache: "force-cache",
      // next: { revalidate: 900 },
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
};

export const updateLead = async (leadData: any) => {
  const headers = await authConfig();
  try {
    const response = await fetch(`${BASE_URL}lead/${leadData.id}/`, {
      method: "PUT",
      headers,
      body: JSON.stringify(leadData),
    });

    const data = await response.json();

    if (response.ok) {
      return { message: "Successfully Updated!" };
    } else {
      throw new Error(data.message || "Something went wrong, Please try again!");
    }
  } catch (error: any) {
    return { error: error.message };
  }
};

export const deleteLead = async (id: any) => {
  const headers = await authConfig();
  try {
    const response = await fetch(`${BASE_URL}leads/${id}/`, {
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

export const deleteMultiLead = async (ids: any) => {
  const headers = await authConfig();

  try {
    const response = await fetch(`${BASE_URL}/leads/multiple-delete`, {
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

export const readLead = async (id: string) => {
  const headers = await authConfig();

  try {
    const response = await fetch(`${BASE_URL}lead/${id}/`, {
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

export const createLead = async (leadData: any) => {
  const headers = await authConfig();

  try {
    const response = await fetch(`${BASE_URL}leads/`, {
      method: "POST",
      headers,
      body: JSON.stringify(leadData),
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




