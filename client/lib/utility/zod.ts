import { z } from 'zod';

/* -------------------- Credential Schema -------------------- */

export const credentialsSchema = z.object({
    fullname: z.string().min(3, "Full name is required").optional(),
    email: z.string().email("Invalid email address"),
    password: z.string()
        .min(6, "Password must be at least 6 characters long")
        .max(20, "Password must be no more than 20 characters long")
        .refine((val) => /[A-Z]/.test(val), "Password must include at least one uppercase letter")
        .refine((val) => /[a-z]/.test(val), "Password must include at least one lowercase letter")
});

/* -------------------- Faq Schema -------------------- */

export const faqSchema = z.object({
    question: z.string().min(10, "Question is required and must be at least 10 characters long"),
    answer: z.string().min(15, "Answer is required and must be at least 15 characters long"),
})

/* -------------------- Task Schema -------------------- */

export const taskSchema = z.object({
    title: z.string().min(3, "Title is required").max(100, "Title must be no more than 100 characters long"),
    description: z.string().min(10, "Description is required").max(500, "Description must be no more than 500 characters long"),
    assigned_agent: z.string().min(1, "Assign agent is required"),
    priority: z.enum(['Low', 'Medium', 'High']).optional(),
});

/* -------------------- Customer Schema -------------------- */


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

/* -------------------- Invoice Schema -------------------- */
export const invoiceItemSchema = z.object({
    product: z.object({
        _id: z.string().min(1, "Product ID is required"),
    }),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    discount: z.number().min(0, "Discount must be at least 0").optional(),
    unit_price: z.number().min(0, "Unit price must be at least 0"),
    total_price: z.number().min(0, "Total must be at least 0").optional(),
});

export const invoiceSchema = z.object({
    tax: z.number().min(0, "Tax must be at least 0"),
    customer: z.string().min(1, "Customer is required"),
    due_date: z.string().min(1, "Due date is required"),
    status: z.enum(['draft', 'paid', 'unpaid', 'cancelled']).default('draft'),
    additional_note: z.string().optional(),
    shipping_cost: z.number().min(0, "Shipping cost must be at least 0"),
    discount: z.number().min(0, "Discount must be at least 0"),
    payment_type: z.enum(['cash', 'card', 'bank', 'other']).default('cash'),
    invoice_items: z.array(invoiceItemSchema).min(1, "At least one invoice item is required"),
});