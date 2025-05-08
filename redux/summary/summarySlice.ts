import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { JournalEntry } from '../callLogs/callLogsSlice';

export interface Summary {
    id: string;
    content: string;
    date: string;
    entries: JournalEntry[];
}

interface SummaryState {
    summaries: Summary[];
    loading: boolean;
    error: string | null;
}

const initialState: SummaryState = {
    summaries: [],
    loading: false,
    error: null
};

export const generateSummary = createAsyncThunk(
    'summary/generateSummary',
    async (entries: JournalEntry[]) => {
        try {
            const response = await axios.post('http://10.0.0.162:5001/api/summaries', { entries });
            return {
                id: Date.now().toString(),
                content: response.data.summary,
                date: new Date().toISOString(),
                entries
            };
        } catch (error) {
            throw error instanceof Error ? error.message : 'Failed to generate summary';
        }
    }
);

const summarySlice = createSlice({
    name: 'summary',
    initialState,
    reducers: {
        clearSummaries: (state) => {
            state.summaries = [];
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(generateSummary.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(generateSummary.fulfilled, (state, action) => {
                state.loading = false;
                state.summaries.unshift(action.payload); // Add new summary at the beginning
            })
            .addCase(generateSummary.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to generate summary';
            });
    }
});

export const { clearSummaries } = summarySlice.actions;
export default summarySlice.reducer; 