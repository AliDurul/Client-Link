import { createAppSlice } from "@/lib/createAppSlice";
import type { AppThunk } from "@/lib/store";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getAllLeads } from "./leadAPI";
import { ApiResponse, ILead, Pagination } from "@/types/types";

export interface LeadSliceState {
    leads: Pagination<ILead>;
    status: "idle" | "loading" | "failed";
    error: null | string;
    lead: null | ILead;
    ticketModal: boolean;
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
    ticketModal: false,

};

export const leadSlice = createAppSlice({
    name: 'lead',
    initialState,
    reducers: (create) => ({
        setLeadModal: create.reducer((state, action: PayloadAction<boolean>) => {
            state.status = 'idle';
            state.ticketModal = action.payload;
        }),
        updateLeadState: create.reducer((state, action: PayloadAction<ILead | null>) => {
            state.status = 'idle';
            state.lead = action.payload;
        }),
        updateLeads: create.reducer((state, action: PayloadAction<ILead[]>) => {
            state.status = 'idle';
            state.leads.results = action.payload;
        }),
        fetchAllLeadsAsync: create.asyncThunk(
            async (params: { page?: string, pageSize?: string, search?: string }) => {
                const { page, pageSize, search } = params
                try {
                    const response: ApiResponse = await getAllLeads(page, pageSize, search);
                    if (response.error) {
                        throw new Error(response.error);
                    }
                    return response;
                } catch (error) {
                    throw new Error("Data fetch failed: " + (error as Error).message);
                }

            },
            {
                pending: (state) => { state.status = "loading"; },
                fulfilled: (state, action) => { state.status = "idle"; state.leads = action.payload; },
                rejected: (state, action) => { state.status = "failed"; state.error = action.error.message || null; },
            },
        ),
    }),
    selectors: {
        selectLead: (lead) => lead.lead,
        selectLeadStates: (lead) => lead,
        selectLeadModal: (lead) => lead.ticketModal,
    }
});

export const { fetchAllLeadsAsync, updateLeadState, updateLeads, setLeadModal } = leadSlice.actions;

export const { selectLead, selectLeadStates, selectLeadModal } = leadSlice.selectors