import { createAppSlice } from "@/lib/createAppSlice"
import { PayloadAction } from "@reduxjs/toolkit";
import { getAllChats } from "./chatActions";
import { Chat } from "@/types";
import { createApiThunk, createAsyncThunkConfig } from "../shared/sliceUtils";

export interface ChatSliceState {
    chats: Chat[];
    status: "idle" | "loading" | "failed";
    error: string | null
    chat: null | Chat;
    isShowChatMenu: boolean;
}

const initialState: ChatSliceState = {
    chats: [],
    status: "idle",
    error: null,
    chat: null,
    isShowChatMenu: false
}


export const chatSlice = createAppSlice({
    name: 'chat',
    initialState,
    reducers: ({ reducer, asyncThunk }) => ({
        // Entity management
        setChat: reducer((state, action: PayloadAction<Chat>) => {
            state.status = 'idle';
            state.chat = action.payload;
        }),
        clearChat: reducer((state) => {
            state.chat = null;
        }),

        // Collection management
        setChats: reducer((state, action: PayloadAction<Chat[]>) => {
            state.status = 'idle';
            state.chats = action.payload;
        }),
        updateChatsState: reducer((state, action: PayloadAction<Chat>) => {
            state.status = 'idle';
            if (!state.chats.some(chat => chat.id === action.payload.id)) {
                state.chats.push(action.payload)
            }
        }),

        // UI state management
        setIsShowChatMenu: reducer((state, action: PayloadAction<boolean>) => {
            state.isShowChatMenu = action.payload;
        }),
        toggleChatMenu: reducer((state) => {
            state.isShowChatMenu = !state.isShowChatMenu;
        }),

        // Async actions
        fetchAllChatsAsync: asyncThunk(
            async () => {
                return createApiThunk(
                    () => getAllChats(),
                    "Failed to fetch chats"
                );
            },
            createAsyncThunkConfig('chats')
        ),
    }),
    selectors: {
        selectChats: (chat) => chat.chats,
        selectChat: (chat) => chat.chat,
        selectChatStatus: (chat) => chat.status,
        selectChatError: (chat) => chat.error,
        selectIsShowChatMenu: (chat) => chat.isShowChatMenu,
        selectChatStates: (chat) => chat
    }
})

export const { 
    setChat, 
    clearChat,
    setChats, 
    fetchAllChatsAsync, 
    setIsShowChatMenu, 
    toggleChatMenu,
    updateChatsState 
} = chatSlice.actions;

export const { 
    selectChats, 
    selectChat, 
    selectChatStatus, 
    selectChatError,
    selectIsShowChatMenu,
    selectChatStates 
} = chatSlice.selectors;