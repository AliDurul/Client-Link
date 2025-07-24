"use server";
import { auth } from "@/auth";

const BASE_URL = process.env.API_BASE_URL + '/';

const authConfig = async () => {
  const session = await auth();
  const accessToken = session?.access;

  return {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
};


export const updateTask = async (taskData: any) => {
  const headers = await authConfig();
  try {
    const response = await fetch(`${BASE_URL}task/${taskData.id}/`, {
      method: "PUT",
      headers,
      body: JSON.stringify(taskData),
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

export const deleteTask = async (id: number) => {
  const headers = await authConfig();
  try {
    const response = await fetch(`${BASE_URL}task/${id}/`, {
      method: "DELETE",
      headers,
    });

    const data = await response.json();

    if (response.status === 200) {
      return { message: data.message, remainingData: data.data.reverse() };
    } else {
      throw new Error(data.detail ?? "Something went wrong, Please try again!");
    }

  } catch (error: any) {
    return { error: error.message };
  }
};


export const readTask = async (id: string) => {
  const headers = await authConfig();

  try {
    const response = await fetch(`${BASE_URL}task/${id}/`, {
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


export const createTask = async (taskData: any) => {
  const headers = await authConfig();
  try {
    const response = await fetch(`${BASE_URL}tasks/`, {
      method: "POST",
      headers,
      body: JSON.stringify(taskData),
    });

    const data = await response.json();
    if (response.ok) {
      return { message: data.message };
    } else {
      throw new Error(data.error || "Something went wrong, Please try again!");
    }
  } catch (error: any) {
    return { error: error.message };
  }
};





