import { z } from 'zod';

export const credentialsSchema = z.object({
    fullname: z.string().min(3, "Full name is required").optional(),
    email: z.string().email("Invalid email address"),
    password: z.string()
        .min(6, "Password must be at least 6 characters long")
        .max(20, "Password must be no more than 20 characters long")
        .refine((val) => /[A-Z]/.test(val), "Password must include at least one uppercase letter")
        .refine((val) => /[a-z]/.test(val), "Password must include at least one lowercase letter")
});


export const faqSchema = z.object({
    question: z.string().min(10, "Question is required and must be at least 10 characters long"),
    answer: z.string().min(15, "Answer is required and must be at least 15 characters long"),
})

export const taskSchema = z.object({
    title: z.string().min(3, "Title is required").max(100, "Title must be no more than 100 characters long"),
    description: z.string().min(10, "Description is required").max(500, "Description must be no more than 500 characters long"),
    asign_agent: z.string().min(1, "Assign agent is required"),
    priority: z.enum(['Low', 'Medium', 'High']).optional(),
});