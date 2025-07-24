import { createAppSlice } from "@/lib/createAppSlice";
import { getAllCoparates } from "./coparateAPI";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ApiResponse, Coparate, Pagination } from "@/types";


export interface CoparateSliceState {
    coparates: Pagination<Coparate>;
    coparate: Coparate | null | undefined
    status: "idle" | "loading" | "failed";
    error: null | string;
    value: string;
    activeUsers: any[]
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
        updateCoparates: reducer((state, action: PayloadAction<Coparate[]>) => {
            state.status = 'idle';
            state.coparates.results = action.payload;
        }),
        setValue: reducer((state, { payload }: PayloadAction<string>) => {
            state.status = 'idle';
            state.value = payload;
        }),
        updateCoparateState: reducer((state, action: PayloadAction<Coparate | null | undefined>) => {
            state.status = 'idle';
            state.coparate = action.payload;
        }),
        setActiveUsersState: reducer((state, action: PayloadAction<any[]>) => {
            state.activeUsers = action.payload
        }),
        fetchAllCoparateAsync: asyncThunk(
            async (params: { page?: string, pageSize?: string, search?: string }) => {
                const { page, pageSize, search } = params
                try {
                    const response: ApiResponse = await getAllCoparates(page, pageSize, search);
                    if (response.error) {
                        throw new Error(response.error);
                    }
                    return response;
                } catch (error) {
                    console.log(error)
                    throw new Error("Data fetch failed: " + (error as Error).message);
                }
            },
            {
                pending: (state) => { state.status = "loading"; },
                fulfilled: (state, action) => { state.status = "idle"; state.coparates = action.payload; },
                rejected: (state, action) => { state.status = "failed"; state.error = action.error.message || null; },
            },
        ),
    }),
    selectors: {
        selectCoparates: (coparate) => coparate.coparates,
        selectCoparate: (coparate) => coparate.coparate,
        selectCoparateValue: (coparate) => coparate.value,
        selectCoparateState: (coparate) => coparate,
        selectCoparateStatus: (coparate) => coparate.status,
        selectActiveUsers: (coparate) => coparate.activeUsers
    }
});

export const { fetchAllCoparateAsync, updateCoparates, updateCoparateState, setValue, setActiveUsersState } = coparateSlice.actions;

export const { selectCoparateValue, selectCoparates, selectCoparateState, selectCoparate, selectCoparateStatus, selectActiveUsers } = coparateSlice.selectors