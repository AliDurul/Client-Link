"use server";
import { auth } from "@/auth";
import { taskSchema } from "@/lib/utility/zod";
import { revalidateTag } from "next/cache";
import { success } from "zod";

const BASE_URL = process.env.API_BASE_URL + '/';

interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
  error?: string;
  detail?: string;
}

interface TaskData {
  _id?: string;
  title: string;
  description: string;
  assigned_agent: string;
  priority: string;
}

const getAuthHeaders = async () => {
  const session = await auth();

  if (!session?.access) {
    throw new Error('Authentication required');
  }

  return {
    Authorization: `Bearer ${session.access}`,
    "Content-Type": "application/json",
  };
};

const handleApiResponse = async <T>(response: Response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};


export const updateTask = async (taskData: TaskData | { status: string, _id: number }) => {
  try {
    const headers = await getAuthHeaders();
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

export const deleteTask = async (id: number) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}tasks/${id}/`, {
      method: "DELETE",
      headers,
    });

    if (response.status !== 204) throw new Error("Something went wrong while deleting the task");

    revalidateTag('tasks');
    return { success: true, message: "Task deleted successfully" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const readTask = async (id: string) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}task/${id}/`, { headers });

    return await handleApiResponse(response);
  } catch (error: any) {
    return { error: error.message };
  }
};

export const taskCrUpAction = async (_: unknown, payload: FormData) => {
  try {
    const headers = await getAuthHeaders();
    const id = payload.get('id') as string;

    const rowData = {
      title: payload.get('title') as string,
      description: payload.get('description') as string,
      assigned_agent: payload.get('assigned_agent') as string,
      priority: payload.get('priority') as string
    };

    // Validate form data
    const result = taskSchema.safeParse(rowData);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return {
        success: false,
        message: 'Please fix the validation errors',
        inputs: rowData,
        errors
      };
    }

    // Determine API endpoint and method
    const isUpdate = Boolean(id);
    const url = isUpdate ? `${BASE_URL}tasks/${id}/` : `${BASE_URL}tasks/`;
    const method = isUpdate ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(result.data),
    });

    await handleApiResponse(response);

    // Revalidate cache
    revalidateTag('tasks');

    return {
      message: isUpdate ? "Task updated successfully!" : "Task created successfully!",
      success: true
    };

  } catch (error: any) {
    return {
      message: error.message,
      success: false,
      inputs: Object.fromEntries(payload.entries())
    };
  }
};


export const getCountDetail = async () => {
  try {
    const headers = await getAuthHeaders();
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


