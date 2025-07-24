
import { createAppSlice } from "@/lib/createAppSlice";
import { getAllCategories } from "./categoryAPI";
import { Category } from "@/types";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createApiThunk, createAsyncThunkConfig } from "../shared/sliceUtils";

export interface CategorySliceState {
    categories: Category[];
    status: "idle" | "loading" | "failed";
    error: string | null;
}

const initialState: CategorySliceState = {
    categories: [],
    status: "idle",
    error: null
};

export const categorySlice = createAppSlice({
    name: 'category',
    initialState,
    reducers: (create) => ({
        // Collection management
        updateCategories: create.reducer((state, action: PayloadAction<Category[]>) => {
            state.status = 'loading';
            state.categories = action.payload;
        }),
        setCategories: create.reducer((state, action: PayloadAction<Category[]>) => {
            state.status = 'idle';
            state.categories = action.payload;
        }),

        // Async actions
        fetchAllCategoryAsync: create.asyncThunk(
            async () => {
                return createApiThunk(
                    () => getAllCategories(),
                    "Failed to fetch categories"
                );
            },
            createAsyncThunkConfig('categories')
        ),
    }),
    selectors: {
        selectCategories: (category) => category.categories,
        selectCategoryStatus: (category) => category.status,
        selectCategoryError: (category) => category.error,
        selectCategoryState: (category) => category,
    }
});

export const {
    fetchAllCategoryAsync,
    updateCategories,
    setCategories
} = categorySlice.actions;

export const {
    selectCategories,
    selectCategoryStatus,
    selectCategoryError,
    selectCategoryState
} = categorySlice.selectors;
