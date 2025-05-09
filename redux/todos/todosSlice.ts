import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = "http://10.0.0.162:5002/api/todos";

export type TodoItem = {
    id: string;
    text: string;
    completed: boolean;
    createdAt: string;
    dueDate?: string;
    priority: 'low' | 'medium' | 'high';
} | {
    message: string;
}

interface TodosState {
    items: TodoItem[];
    loading: boolean;
    error: string | null;
}

const initialState: TodosState = {
    items: [],
    loading: false,
    error: null
};

interface ApiTodoResponse {
    success: boolean;
    data: {
        todos: Array<{
            description: string;
            priority: 'low' | 'medium' | 'high';
            due_date: string | null;
        }>;
        transcription: string;
    };
}

export const createTodo = createAsyncThunk(
    'todos/createTodo',
    async (transcript: string) => {
        try {
            const response = await axios.post<ApiTodoResponse>(`${BASE_URL}/create`, { transcript });
            if (!response.data.success) {
                throw new Error('Failed to create todo');
            }
            // Transform the API todo format to our TodoItem format
            const todo = response.data.data.todos[0];
            return {
                id: Date.now().toString(), // Generate a temporary ID
                text: todo.description,
                completed: false,
                createdAt: new Date().toISOString(),
                dueDate: todo.due_date || undefined,
                priority: todo.priority
            };
        } catch (error) {
            throw error instanceof Error ? error.message : 'Failed to create todo';
        }
    }
);

const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        clearTodos: (state) => {
            state.items = [];
            state.error = null;
        },
        toggleTodo: (state, action) => {
            const todo = state.items.find(item => 'id' in item && item.id === action.payload);
            if (todo && 'completed' in todo) {
                todo.completed = !todo.completed;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Create Todo
            .addCase(createTodo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTodo.fulfilled, (state, action) => {
                state.loading = false;
                if (!('message' in action.payload)) {
                    state.items = [...state.items, action.payload];
                }
            })
            .addCase(createTodo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create todo';
            });
    }
});

export const { clearTodos, toggleTodo } = todosSlice.actions;
export default todosSlice.reducer; 