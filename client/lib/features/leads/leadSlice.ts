import { createAppSlice } from "@/lib/createAppSlice";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getAllLeads } from "./leadAPI";
import { ApiResponse, ILead, Pagination } from "@/types";
import { createApiThunk, createAsyncThunkConfig } from "../shared/sliceUtils";

export interface LeadSliceState {
    leads: Pagination<ILead>;
    status: "idle" | "loading" | "failed";
    error: string | null;
    lead: ILead | null;
    leadModal: boolean;
}

const initialState: LeadSliceState = {
    leads: {
        count: 0,
        next: null,
        previous: null,
        results: []
    },
    status: "idle",
    error: null,
    lead: null,
    leadModal: false,
};

export const leadSlice = createAppSlice({
    name: 'lead',
    initialState,
    reducers: (create) => ({
        // Entity management
        setLead: create.reducer((state, action: PayloadAction<ILead | null>) => {
            state.status = 'idle';
            state.lead = action.payload;
        }),
        clearLead: create.reducer((state) => {
            state.lead = null;
        }),

        // Collection management
        updateLeads: create.reducer((state, action: PayloadAction<ILead[]>) => {
            state.status = 'idle';
            state.leads.results = action.payload;
        }),

        // Modal management
        setLeadModal: create.reducer((state, action: PayloadAction<boolean>) => {
            state.status = 'idle';
            state.leadModal = action.payload;
        }),
        toggleLeadModal: create.reducer((state) => {
            state.leadModal = !state.leadModal;
        }),

        // Async actions
        fetchAllLeadsAsync: create.asyncThunk(
            async (params: { page?: string, pageSize?: string, search?: string }) => {
                return createApiThunk(
                    () => getAllLeads(params.page, params.pageSize, params.search),
                    "Failed to fetch leads"
                );
            },
            createAsyncThunkConfig('leads')

        ),
    }),
    selectors: {
        selectLeads: (lead) => lead.leads,
        selectLead: (lead) => lead.lead,
        selectLeadStates: (lead) => lead,
        selectLeadModal: (lead) => lead.leadModal,
        selectLeadStatus: (lead) => lead.status,
        selectLeadError: (lead) => lead.error,
    }
});

export const {
    fetchAllLeadsAsync,
    setLead,
    clearLead,
    updateLeads,
    setLeadModal,
    toggleLeadModal
} = leadSlice.actions;

export const {
    selectLeads,
    selectLead,
    selectLeadStates,
    selectLeadModal,
    selectLeadStatus,
    selectLeadError
} = leadSlice.selectors;