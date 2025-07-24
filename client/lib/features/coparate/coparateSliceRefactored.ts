import { createAppSlice } from "@/lib/createAppSlice";
import { getAllCoparates } from "./coparateAPI";
import { ApiResponse, Coparate, Pagination } from "@/types";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunkConfig, createApiThunk } from "../shared/sliceUtils";

export interface CoparateSliceState {
    coparates: Pagination<Coparate>;
    coparate: Coparate | null;
    status: "idle" | "loading" | "failed";
    error: string | null;
    value: string;
    activeUsers: any[];
}

const initialState: CoparateSliceState = {
    coparates: {
        count: 0,
        next: null,
        previous: null,
        results: []
    },
    status: "idle",
    error: null,
    coparate: null,
    value: 'list',
    activeUsers: []
};

export const coparateSlice = createAppSlice({
    name: 'coparate',
    initialState,
    reducers: ({ reducer, asyncThunk }) => ({
        // Entity management
        setCoparate: reducer((state, action: PayloadAction<Coparate | null>) => {
            state.status = 'idle';
            state.coparate = action.payload;
        }),
        clearCoparate: reducer((state) => {
            state.coparate = null;
        }),

        // Collection management
        updateCoparates: reducer((state, action: PayloadAction<Coparate[]>) => {
            state.status = 'idle';
            state.coparates.results = action.payload;
        }),

        // UI state
        setValue: reducer((state, action: PayloadAction<string>) => {
            state.status = 'idle';
            state.value = action.payload;
        }),
        setActiveUsers: reducer((state, action: PayloadAction<any[]>) => {
            state.activeUsers = action.payload;
        }),

        // Async actions
        fetchAllCoparateAsync: asyncThunk(
            async (params: { page?: string; pageSize?: string; search?: string }) => {
                return createApiThunk(() => getAllCoparates(params.page, params.pageSize, params.search), "Failed to fetch coparates");
            },
            createAsyncThunkConfig('coparates')
        ),
    }),
    selectors: {
        selectCoparates: (state) => state.coparates,
        selectCoparate: (state) => state.coparate,
        selectCoparateValue: (state) => state.value,
        selectCoparateState: (state) => state,
        selectCoparateStatus: (state) => state.status,
        selectActiveUsers: (state) => state.activeUsers,
    }
});

export const {
    fetchAllCoparateAsync,
    updateCoparates,
    setCoparate,
    clearCoparate,
    setValue,
    setActiveUsers
} = coparateSlice.actions;

export const {
    selectCoparateValue,
    selectCoparates,
    selectCoparateState,
    selectCoparate,
    selectCoparateStatus,
    selectActiveUsers
} = coparateSlice.selectors;
