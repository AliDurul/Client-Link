import { PayloadAction } from "@reduxjs/toolkit";

// async thunk configuration factory
export const createAsyncThunkConfig = <TState, TData>(
    dataPropertyName: keyof TState
) => ({
    pending: (state: TState & { status: string; error: string | null }) => {
        state.status = "loading";
        state.error = null;
    },
    fulfilled: (state: TState & { status: string; error: string | null }, action: { payload: TData }) => {
        state.status = "idle";
        (state as any)[dataPropertyName] = action.payload;
        state.error = null;
    },
    rejected: (state: TState & { status: string; error: string | null }, action: any) => {
        state.status = "failed";
        state.error = action.error.message || "An error occurred";
    },
});


// Generic API call wrapper
export const createApiThunk = async <TResponse>(
    apiCall: () => Promise<TResponse>,
    errorMessage: string = "API call failed"
): Promise<TResponse> => {
    try {
        const response = await apiCall();
        // @ts-ignore
        if (response?.error) {
            // @ts-ignore
            throw new Error(response.error);
        }
        return response;
    } catch (error) {
        throw new Error(`${errorMessage}: ${(error as Error).message}`);
    }
};

