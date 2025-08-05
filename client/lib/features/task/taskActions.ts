"use server";
import { auth } from "@/auth";
import { taskSchema } from "@/lib/utility/zod";
import { revalidateTag } from "next/cache";
import { success } from "zod";
import { authConfig } from "../shared/actionUtils";

const BASE_URL = process.env.API_BASE_URL + '/';


interface TaskData {
  _id?: string;
  title: string;
  description: string;
  assigned_agent: string;
  priority: string;
}


const handleApiResponse = async <T>(response: Response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

export const taskCrUpAction = async (_: unknown, payload: FormData) => {
  const id = payload.get('id') as string;

  const rowData = {
    title: payload.get('title') as string,
    description: payload.get('description') as string,
    assigned_agent: payload.get('assigned_agent') as string,
    priority: payload.get('priority') as string
  };

  const result = taskSchema.safeParse(rowData);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { success: false, message: 'Fix the error in the form', inputs: rowData, errors };
  }

  const url = id ? `${BASE_URL}tasks/${id}/` : `${BASE_URL}tasks/`;
  const method = id ? "PUT" : "POST";

  try {
    const headers = await authConfig();

    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(result.data),
    });

    await handleApiResponse(response);

    revalidateTag('tasks');
    return {
      message: id ? "Task updated successfully!" : "Task created successfully!",
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

export const getTask = async (id: string) => {
  try {
    const headers = await authConfig();
    const response = await fetch(`${BASE_URL}task/${id}/`, { headers });

    return await handleApiResponse(response);
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong, Please try again!" };
  }
};

export const delTask = async (id: number) => {
  try {
    const headers = await authConfig();
    const response = await fetch(`${BASE_URL}tasks/${id}/`, {
      method: "DELETE",
      headers,
    });

    if (response.status !== 204) throw new Error("Something went wrong while deleting the task");

    revalidateTag('tasks');
    return { success: true, message: "Task deleted successfully" };
  } catch (error: any) {
    return { success: false, message: error.message || "Something went wrong, Please try again!" };

  }
};


export const getCountDetail = async () => {
  try {
    const headers = await authConfig();
    const response = await fetch(`${BASE_URL}tasks/count/`, {
      headers,
      next: { tags: ['task-count'] }
    });

    const data = await handleApiResponse(response);
    return { success: true, ...data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};


export const putTaskStatus = async (taskData: TaskData | { status: string, _id: number }) => {
  try {
    const headers = await authConfig();
    const response = await fetch(`${BASE_URL}tasks/${taskData._id}/`, {
      method: "PUT",
      headers,
      body: JSON.stringify(taskData),
    });

    revalidateTag('tasks');
    return await handleApiResponse(response);
  } catch (error: any) {
    return { message: error.message, success: false };
  }
};

