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
    assigned_agent: z.string().min(1, "Assign agent is required"),
    priority: z.enum(['Low', 'Medium', 'High']).optional(),
});


export const customerSchema = z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    profession: z.string().optional(),
    dob: z.string().min(1, "Date of birth is required"), 
    email: z.string().email("Invalid email address"),
    phone_number: z.string().min(1, "Phone number is required"),
    gender: z.string().min(1, "Gender is required"),
    id_type: z.string().min(1, "ID type is required"),
    id_number: z.string().min(1, "ID number is required"),
    religion: z.string().min(1, "Religion is required"),
    marital_status: z.string().min(1, "Marital status is required"),
    boys: z.union([z.string(), z.number()]).optional(),
    girls: z.union([z.string(), z.number()]).optional(),
    street: z.string().min(1, "Street is required"),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    zip_code: z.string().optional(),
    father_name: z.string().optional(),
    mother_name: z.string().optional(),
    witness_name: z.string().optional(),
    witness_relation: z.string().optional(),
    nationality: z.string().min(1, "Nationality is required"),
    finincial_institution: z.string().optional(),
    medication: z.boolean(),
    medication_type: z.string().optional().nullable(),
    profile_pic: z.any().optional(), // file/image, adjust as needed
});