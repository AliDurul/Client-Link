import { createAppSlice } from "@/lib/createAppSlice";
import { ApiResponse, Kyc, Pagination } from "@/types";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createApiThunk, createAsyncThunkConfig, sharedInitialState } from "../shared/sliceUtils";


export interface KycSliceState {
    kycs: Pagination<Kyc>;
    kyc: Kyc | null;
    status: "idle" | "loading" | "failed";
    error: string | null;
    type: 'list' | 'grid';
    activeUsers: any[];
}

const initialState: KycSliceState = {
    kycs: sharedInitialState,
    status: "idle",
    error: null,
    kyc: null,
    type: 'list',
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
            state.kycs.result = action.payload;
        }),

        // UI state management
        setType: reducer((state, action: PayloadAction<'list' | 'grid'>) => {
            state.status = 'idle';
            state.type = action.payload;
        }),
        setActiveUsers: reducer((state, action: PayloadAction<any[]>) => {
            state.activeUsers = action.payload;
        }),

        // // Async actions
        // fetchAllKycAsync: asyncThunk(
        //     async (params: { type?: string, page?: string, pageSize?: string, search?: string }) => {
        //         return createApiThunk(
        //             () => getAllKycs(params.type, params.page, params.pageSize, params.search),
        //             "Failed to fetch KYC data"
        //         );
        //     },
        //     createAsyncThunkConfig('kycs')

        // ),
    }),
    selectors: {
        selectKycs: (kyc) => kyc.kycs,
        selectKyc: (kyc) => kyc.kyc,
        selectType: (kyc) => kyc.type,
        selectKycState: (kyc) => kyc,
        selectKycStatus: (kyc) => kyc.status,
        selectKycError: (kyc) => kyc.error,
        selectActiveUsers: (kyc) => kyc.activeUsers
    }
});

export const {
    // fetchAllKycAsync,
    updateKycs,
    setKyc,
    clearKyc,
    setType,
    setActiveUsers
} = kycSlice.actions;

export const {
    selectType,
    selectKycs,
    selectKycState,
    selectKyc,
    selectKycStatus,
    selectKycError,
    selectActiveUsers
} = kycSlice.selectors;