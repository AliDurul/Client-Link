import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { themeSlice } from "./features/theme/themeSlice";
// import { invoiceSlice } from "./features/invoices/invoiceSlice";
// import { ticketSlice } from "./features/tickets/ticketSlice";
// import { categorySlice } from "./features/category/categorySlice";
import { kycSlice } from "./features/kyc/kycSlice";
// import { productSlice } from "./features/products/productSlice";
import { faqSlice } from "./features/faq/faqSlice";
import { taskSlice } from "./features/task/taskSlice";
// import { chatSlice } from "./features/chat/chatSlice";
// import { leadSlice } from "./features/leads/leadSlice";
// import { coparateSlice } from "./features/coparate/coparateSlice";

const rootReducer = combineSlices(
    themeSlice,
    // invoiceSlice,
    // ticketSlice,
    // categorySlice,
    kycSlice,
    // productSlice,
    faqSlice,
    taskSlice,
    // chatSlice,
    // leadSlice,
    // coparateSlice
);
export type RootState = ReturnType<typeof rootReducer>;


export const makeStore = () => {
    return configureStore({
        reducer: rootReducer,
    });
};
// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
    ThunkReturnType,
    RootState,
    unknown,
    Action
>;
