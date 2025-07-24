export type LoginFormState = {
    success: boolean;
    message: string;
    errors?: {
        email?: string[];
        password?: string[];
    };
    inputs?: {
        email: FormDataEntryValue;
        password: FormDataEntryValue;
    };
} | undefined;