import { createAppSlice } from "@/lib/createAppSlice";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ApiResponse, Pagination, Task } from "@/types";
import { createApiThunk, createAsyncThunkConfig } from "../shared/sliceUtils";

export interface TaskSliceState {
    tasks: Pagination<Task>;
    status: "idle" | "loading" | "failed";
    error: string | null;
    task: Task | null;
}

const initialState: TaskSliceState = {
    tasks: {
        count: 0,
        next: null,
        previous: null,
        results: []
    },
    status: "idle",
    error: null,
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
    }
});

export const { 
    // fetchAllTasksAsync, 
    setTask, 
    clearTask,
    updateTasks 
} = taskSlice.actions;

export const { 
    selectTasks, 
    selectTaskStatus, 
    selectTaskError,
    selectTask,
    selectTaskState
} = taskSlice.selectors;