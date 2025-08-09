import { createAppSlice } from "@/lib/createAppSlice";
import { Pagination, Product, ProductDefaultParams } from "@/types";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createApiThunk, createAsyncThunkConfig, sharedInitialState } from "../shared/sliceUtils";



export interface ProductSliceState {
    products: Pagination<any>;
    product: Product | null;
    productModal: boolean;
    status: "idle" | "loading" | "failed";
    error: string | null;
}

const initialState: ProductSliceState = {
    products: sharedInitialState,
    product: null,
    productModal: false,
    status: "idle",
    error: null,
};

export const productSlice = createAppSlice({
    name: 'product',
    initialState,
    reducers: (create) => ({
        // Collection management
        updateProducts: create.reducer((state, action: PayloadAction<Product[]>) => {
            state.status = 'idle';
            state.products.result = action.payload;
        }),

        // Entity management
        setProduct: create.reducer((state, action: PayloadAction<Product | null >) => {
            state.status = 'idle';
            state.product = action.payload;
        }),
        clearProduct: create.reducer((state) => {
            // Reset to initial default state
            state.product = initialState.product;
        }),

        // Modal management
        setProductModal: create.reducer((state, action: PayloadAction<boolean>) => {
            state.status = 'idle';
            state.productModal = action.payload;
        }),
        toggleProductModal: create.reducer((state) => {
            state.productModal = !state.productModal;
        }),

   

    }),
    selectors: {
        selectProducts: (product) => product.products,
        selectProduct: (product) => product.product,
        selectProductState: (product) => product,
        selectProductModal: (product) => product.productModal,
        selectProductStatus: (product) => product.status,
        selectProductError: (product) => product.error,
    }
});

export const {
    updateProducts,
    setProduct,
    clearProduct,
    setProductModal,
    toggleProductModal,
} = productSlice.actions;

export const {
    selectProducts,
    selectProductState,
    selectProduct,
    selectProductModal,
    selectProductStatus,
    selectProductError,
} = productSlice.selectors;