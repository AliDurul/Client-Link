import { createAppSlice } from "@/lib/createAppSlice";
import { getAllKycs } from "./kycAPI";
import { ApiResponse, Kyc, Pagination } from "@/types";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createApiThunk, createAsyncThunkConfig } from "../shared/sliceUtils";


export interface KycSliceState {
    kycs: Pagination<Kyc>;
    kyc: Kyc | null;
    status: "idle" | "loading" | "failed";
    error: string | null;
    value: string;
    activeUsers: any[];
}

const initialState: KycSliceState = {
    kycs: {
        count: 0,
        next: null,
        previous: null,
        results: []
    },
    status: "idle",
    error: null,
    kyc: null,
    value: 'list',
    activeUsers: []
};

export const kycSlice = createAppSlice({
    name: 'kyc',
    initialState,
    reducers: ({ reducer, asyncThunk }) => ({
        // Entity management
        setKyc: reducer((state, action: PayloadAction<Kyc | null>) => {
            state.status = 'idle';
            state.kyc = action.payload;
        }),
        clearKyc: reducer((state) => {
            state.kyc = null;
        }),

        // Collection management
        updateKycs: reducer((state, action: PayloadAction<Kyc[]>) => {
            state.status = 'idle';
            state.kycs.results = action.payload;
        }),

        // UI state management
        setValue: reducer((state, action: PayloadAction<string>) => {
            state.status = 'idle';
            state.value = action.payload;
        }),
        setActiveUsers: reducer((state, action: PayloadAction<any[]>) => {
            state.activeUsers = action.payload;
        }),

        // Async actions
        fetchAllKycAsync: asyncThunk(
            async (params: { type?: string, page?: string, pageSize?: string, search?: string }) => {
                return createApiThunk(
                    () => getAllKycs(params.type, params.page, params.pageSize, params.search),
                    "Failed to fetch KYC data"
                );
            },
            createAsyncThunkConfig('kycs')

        ),
    }),
    selectors: {
        selectKycs: (kyc) => kyc.kycs,
        selectKyc: (kyc) => kyc.kyc,
        selectValue: (kyc) => kyc.value,
        selectKycState: (kyc) => kyc,
        selectKycStatus: (kyc) => kyc.status,
        selectKycError: (kyc) => kyc.error,
        selectActiveUsers: (kyc) => kyc.activeUsers
    }
});

export const {
    fetchAllKycAsync,
    updateKycs,
    setKyc,
    clearKyc,
    setValue,
    setActiveUsers
} = kycSlice.actions;

export const {
    selectValue,
    selectKycs,
    selectKycState,
    selectKyc,
    selectKycStatus,
    selectKycError,
    selectActiveUsers
} = kycSlice.selectors;