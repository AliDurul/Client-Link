import { createAppSlice } from "@/lib/createAppSlice";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ApiResponse, Invoice, Pagination } from "@/types";
import { createApiThunk, createAsyncThunkConfig, sharedInitialState } from "../shared/sliceUtils";

export interface InvoiceSliceState {
    invoices: Pagination<Invoice>;
    status: "idle" | "loading" | "failed";
    error: string | null;
    invoice: Invoice | null;
}

const initialState: InvoiceSliceState = {
    invoices: sharedInitialState,
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
            state.invoices.result = action.payload;
        }),

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