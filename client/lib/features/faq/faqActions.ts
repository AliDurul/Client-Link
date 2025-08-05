"use server";
import { auth } from "@/auth"
import { faqSchema } from "@/lib/utility/zod";
import { revalidateTag } from 'next/cache'
import { Faq } from "@/types";
import { authConfig } from "../shared/actionUtils";

const BASE_URL = process.env.API_BASE_URL + '/'


export const delFaq = async (id: any) => {
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


export const faqCrUpAction = async (_: unknown, payload: FormData) => {
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


