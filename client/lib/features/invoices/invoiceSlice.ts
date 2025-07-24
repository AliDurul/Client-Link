import { createAppSlice } from "@/lib/createAppSlice";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getAllInvoices } from "./invoiceAPI";
import { ApiResponse, Invoice, Pagination } from "@/types";
import { createApiThunk, createAsyncThunkConfig } from "../shared/sliceUtils";

export interface InvoiceSliceState {
    invoices: Pagination<Invoice>;
    status: "idle" | "loading" | "failed";
    error: string | null;
    invoice: Invoice | null;
}

const initialState: InvoiceSliceState = {
    invoices: {
        count: 0,
        next: null,
        previous: null,
        results: []
    },
    status: "idle",
    error: null,
    invoice: null
};

export const invoiceSlice = createAppSlice({
    name: 'invoice',
    initialState,
    reducers: (create) => ({
        // Entity management
        setInvoice: create.reducer((state, action: PayloadAction<Invoice | null>) => {
            state.status = 'idle';
            state.invoice = action.payload;
        }),
        clearInvoice: create.reducer((state) => {
            state.invoice = null;
        }),

        // Collection management
        updateInvoices: create.reducer((state, action: PayloadAction<Invoice[]>) => {
            state.status = 'idle';
            state.invoices.results = action.payload;
        }),

        // Async actions
        fetchAllInvoicesAsync: create.asyncThunk(
            async (params: { page?: string, pageSize?: string, search?: string }) => {
                return createApiThunk(
                    () => getAllInvoices(params.page, params.pageSize, params.search),
                    "Failed to fetch invoices"
                );
            },
            createAsyncThunkConfig('invoices')
        ),
    }),
    selectors: {
        selectInvoices: (invoice) => invoice.invoices,
        selectInvoice: (invoice) => invoice.invoice,
        selectInvoiceStates: (invoice) => invoice,
        selectInvoiceStatus: (invoice) => invoice.status,
        selectInvoiceError: (invoice) => invoice.error,
    }
});

export const { 
    fetchAllInvoicesAsync, 
    setInvoice, 
    clearInvoice,
    updateInvoices 
} = invoiceSlice.actions;

export const { 
    selectInvoices,
    selectInvoice, 
    selectInvoiceStates,
    selectInvoiceStatus,
    selectInvoiceError
} = invoiceSlice.selectors;