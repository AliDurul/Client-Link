import { createAppSlice } from "@/lib/createAppSlice";
import { Faq } from "@/types";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getAllFaqs } from "./faqActions";
import { createApiThunk, createAsyncThunkConfig } from "../shared/sliceUtils";

interface DefaultFaqParams {
    question: string;
    answer: string;
    _id?: number;
}

export interface FaqSliceState {
    faqs: Faq[];
    faq: Faq | DefaultFaqParams;
    status: "idle" | "loading" | "failed";
    error: string | null;
    faqModal: boolean;
}

const initialState: FaqSliceState = {
    faqs: [],
    status: "idle",
    faqModal: false,
    error: null,
    faq: {
        question: '',
        answer: '',
    }

};

export const faqSlice = createAppSlice({
    name: 'faq',
    initialState,
    reducers: (create) => ({
        // Collection management
        updateFaqs: create.reducer((state, action: PayloadAction<Faq[]>) => {
            state.status = 'idle';
            state.faqs = action.payload;
        }),
        
        // Entity management
        setFaq: create.reducer((state, action: PayloadAction<Faq | DefaultFaqParams>) => {
            state.status = 'idle';
            state.faq = action.payload;
        }),
        clearFaq: create.reducer((state) => {
            state.faq = {
                question: '',
                answer: '',
            };
        }),
        
        // Modal management
        setFaqModal: create.reducer((state, action: PayloadAction<boolean>) => {
            state.status = 'idle';
            state.faqModal = action.payload;
        }),
        toggleFaqModal: create.reducer((state) => {
            state.faqModal = !state.faqModal;
        }),

        // Async actions
        fetchAllFaqAsync: create.asyncThunk(
            async () => {
                return createApiThunk(
                    () => getAllFaqs(),
                    "Failed to fetch FAQs"
                );
            },
            createAsyncThunkConfig('faqs')
        ),
    }),
    selectors: {
        selectFaqs: (faq) => faq.faqs,
        selectFaq: (faq) => faq.faq,
        selectFaqState: (faq) => faq,
        selectFaqModal: (faq) => faq.faqModal,
        selectFaqStatus: (faq) => faq.status,
        selectFaqError: (faq) => faq.error,
    }
});

export const { 
    fetchAllFaqAsync, 
    updateFaqs, 
    setFaq, 
    clearFaq,
    setFaqModal, 
    toggleFaqModal 
} = faqSlice.actions;

export const { 
    selectFaqs, 
    selectFaqState, 
    selectFaq, 
    selectFaqModal,
    selectFaqStatus,
    selectFaqError
} = faqSlice.selectors;