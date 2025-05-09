import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCallLogs } from '@/vapi/vapi.sdk';
import { createTodo as createTodoAction } from '../todos/todosSlice';

const BASE_URL = "http://10.0.0.162:5002/api/todos/create";

export interface JournalEntry {
    id: string;
    title: string;
    date: string;
    duration: number;
    status: string;
    audioUrl: string;
    transcript: string;
    cost: number;
    endedReason?: string;
    todoCreated: boolean;
}

interface CallLogsState {
    entries: JournalEntry[];
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    page: number;
}

const initialState: CallLogsState = {
    entries: [],
    loading: false,
    error: null,
    hasMore: true,
    page: 1
};

export const createTodo = createAsyncThunk(
    'callLogs/createTodo',
    async ({ entryId, transcript }: { entryId: string; transcript: string }, { dispatch }) => {
        try {
            const result = await dispatch(createTodoAction(transcript)).unwrap();
            // If we get a response that's not an error message, consider it successful
            if (!('message' in result)) {
                return entryId;
            }
            throw new Error('Failed to create todo');
        } catch (error) {
            throw error instanceof Error ? error.message : 'Failed to create todo';
        }
    }
);

export const loadCallLogs = createAsyncThunk(
    'callLogs/loadCallLogs',
    async ({ pageNum = 1, shouldRefresh = false }: { pageNum?: number; shouldRefresh?: boolean }, { getState }) => {
        try {
            const calls = await fetchCallLogs();
            
            if (!calls) {
                throw new Error('No data received from API');
            }

            // Transform Vapi call data into journal entries
            const transformedEntries = calls.map((call: any) => {
                const startTime = call.startedAt ? new Date(call.startedAt).getTime() : 0;
                const endTime = call.endedAt ? new Date(call.endedAt).getTime() : 0;
                const duration = Math.floor((endTime - startTime) / 1000);

                return {
                    id: call.id || 'unknown',
                    title: `Journal Entry - ${new Date(call.createdAt || Date.now()).toLocaleDateString()}`,
                    date: new Date(call.createdAt || Date.now()).toLocaleDateString(),
                    duration: duration,
                    status: call.status || 'unknown',
                    audioUrl: call.recordingUrl || call.artifact?.recordingUrl || '',
                    transcript: call.transcript || call.artifact?.transcript || "No transcript available",
                    cost: call.cost || 0,
                    endedReason: call.endedReason,
                    todoCreated: false
                };
            });

            return {
                entries: transformedEntries,
                page: pageNum,
                shouldRefresh
            };
        } catch (error) {
            throw error instanceof Error ? error.message : 'Failed to load call logs';
        }
    }
);

const callLogsSlice = createSlice({
    name: 'callLogs',
    initialState,
    reducers: {
        clearCallLogs: (state) => {
            state.entries = [];
            state.page = 1;
            state.hasMore = true;
            state.error = null;
        },
        setSearchQuery: (state, action) => {
            // This will be handled in the component using the filtered entries
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadCallLogs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadCallLogs.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.shouldRefresh) {
                    state.entries = action.payload.entries;
                } else {
                    // Filter out duplicates and append new entries
                    const existingIds = new Set(state.entries.map(entry => entry.id));
                    const newEntries = action.payload.entries.filter(
                        (entry: JournalEntry) => !existingIds.has(entry.id)
                    );
                    state.entries = [...state.entries, ...newEntries];
                }
                state.page = action.payload.page;
                state.hasMore = action.payload.entries.length > 0;
            })
            .addCase(loadCallLogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to load call logs';
            })
            .addCase(createTodo.fulfilled, (state, action) => {
                const entry = state.entries.find(entry => entry.id === action.payload);
                if (entry) {
                    entry.todoCreated = true;
                }
            });
    }
});

export const { clearCallLogs, setSearchQuery } = callLogsSlice.actions;
export default callLogsSlice.reducer; 