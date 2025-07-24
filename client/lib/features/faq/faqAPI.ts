"use server";
import { auth } from "@/auth"
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

    const data = await response.json();

    if (response.status === 200) {
      // Revalidate cache after successful creation
      revalidateTag('faqs');
      return { message: data.message, remainingData: data.data };
    } else {
      throw new Error(data.detail ?? "Something went wrong, Please try again!");
    }

  } catch (error: any) {
    return { error: error.message };
  }
};


export const faqUpDelAction = async (_: unknown, payload: FormData) => {
  const headers = await authConfig();
  const id = payload.get('id') as string;
  const question = payload.get('question') as string;
  const answer = payload.get('answer') as string;
  console.log(payload);

  const url = id ? `${BASE_URL}faqs/${id}/` : `${BASE_URL}faqs/`;
  const method = id ? "PUT" : "POST";

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify({ question, answer }),
    });

    const data = await response.json();
    if (response.ok) {
      // Revalidate cache after successful creation
      revalidateTag('faqs');
      return { message: "Successfully Updated!", success: true };
    } else {
      throw new Error(data.message || "Something went wrong, Please try again!");
    }
  } catch (error: any) {
    return { message: error.message, success: false };
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


import { revalidateTag } from 'next/cache'
import { fa } from "zod/locales";
export async function revalidateFaq() {
  console.log('faqs revalite functions');
  revalidateTag('faqs')
} 