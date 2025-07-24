"use server";
import { auth } from "@/auth"
import { faqSchema } from "@/lib/utility/zod";
import { revalidateTag } from 'next/cache'
import { Faq } from "@/types";

const BASE_URL = process.env.API_BASE_URL + '/'

const authConfig = async () => {
  const session = await auth();
  const accessToken = session?.access;

  return {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
};

export const getAllFaqs = async () => {
  const headers = await authConfig();

  try {
    const response = await fetch(`${BASE_URL}faqs/`, {
      headers,
      next: { tags: ['faqs'] }
    });

    const data = await response.json();

    if (response.ok) {
      return data
    } else {
      throw new Error(data.message || "Something went wrong, Please try again!");
    }
  } catch (error: any) {
    return { error: error.message };
  }
};

export const deleteFaq = async (id: any) => {
  const headers = await authConfig();
  try {
    const response = await fetch(`${BASE_URL}faqs/${id}/`, {
      method: "DELETE",
      headers,
    });


    if (!response.ok) {
      throw new Error("Something went wrong, Please try again!");
    }

    revalidateTag('faqs');
    return { message: "Successfully Deleted!" };

  } catch (error: any) {
    return { error: error.message };
  }
};


export const faqUpDelAction = async (_: unknown, payload: FormData) => {
  const headers = await authConfig();
  const id = payload.get('id') as string;

  const rowData = {
    question: payload.get('question') as string,
    answer: payload.get('answer') as string
  };

  const result = faqSchema.safeParse(rowData);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { success: false, message: 'Fix the error in the form', inputs: rowData, errors };
  }


  const url = id ? `${BASE_URL}faqs/${id}/` : `${BASE_URL}faqs/`;
  const method = id ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(result.data),
    });

    const data = await response.json();
    console.log(data);
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong, Please try again!");
    }

    revalidateTag('faqs');
    return { message: "Successfully Updated!", success: true };

  } catch (error: any) {
    return { message: error.message, success: false, inputs: result.data };
  }
};

export const createFaq = async (FaqData: Faq) => {
  const headers = await authConfig();
  try {
    const response = await fetch(`${BASE_URL}faqs/`, {
      method: "POST",
      headers,
      body: JSON.stringify(FaqData),
    });

    const data = await response.json();

    if (response.ok) {
      // Revalidate cache after successful creation
      revalidateTag('faqs');
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


