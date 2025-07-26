import { createAppSlice } from "@/lib/createAppSlice";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ApiResponse, Pagination, Task } from "@/types";
import { createApiThunk, createAsyncThunkConfig } from "../shared/sliceUtils";

export interface TaskSliceState {
    tasks: Pagination<Task>;
    status: "idle" | "loading" | "failed";
    error: string | null;
    task: Task | null;
    isShowTaskMenu: boolean;
    addTaskModal: boolean;
}

const initialState: TaskSliceState = {
    tasks: {
        success: true,
        details: {
            limit: 0,
            page: 1,
            totalRecords: 0,
            pages: {
                previous: false,
                current: 0,
                next: 0,
                total: 0
            }
        },
        results: []
    },
    status: "idle",
    error: null,
    isShowTaskMenu: false,
    addTaskModal: false,
    task: null
};

export const taskSlice = createAppSlice({
    name: 'task',
    initialState,
    reducers: (create) => ({
        // Entity management
        setTask: create.reducer((state, action: PayloadAction<Task | null>) => {
            state.status = 'idle';
            state.task = action.payload;
        }),
        clearTask: create.reducer((state) => {
            state.task = null;
        }),
        // Component management
        setIsShowTaskMenu: create.reducer((state, action: PayloadAction<boolean>) => {
            state.status = 'idle';
            state.isShowTaskMenu = action.payload;
        }),
        setAddTaskModal: create.reducer((state, action: PayloadAction<boolean>) => {
            state.status = 'idle';
            state.addTaskModal = action.payload;
        }),

        // Collection management
        updateTasks: create.reducer((state, action: PayloadAction<Task[]>) => {
            state.status = 'idle';
            state.tasks.results = action.payload;
        }),

        // Async actions
        // fetchAllTasksAsync: create.asyncThunk(
        //     async () => {
        //         return createApiThunk(
        //             () => getAllTasks(),
        //             "Failed to fetch tasks"
        //         );
        //     },
        //     createAsyncThunkConfig('tasks')
        // ),
    }),
    selectors: {
        selectTasks: (task) => task.tasks,
        selectTaskStatus: (task) => task.status,
        selectTaskError: (task) => task.error,
        selectTask: (task) => task.task,
        selectTaskState: (task) => task,
        selectIsShowTaskMenu: (task) => task.isShowTaskMenu,
        selectAddTaskModal: (task) => task.addTaskModal
    }
});

export const {
    // fetchAllTasksAsync, 
    setIsShowTaskMenu,
    setAddTaskModal,
    setTask,
    clearTask,
    updateTasks
} = taskSlice.actions;

export const {
    selectTasks,
    selectTaskStatus,
    selectTaskError,
    selectTask,
    selectTaskState,
    selectIsShowTaskMenu,
    selectAddTaskModal
} = taskSlice.selectors;