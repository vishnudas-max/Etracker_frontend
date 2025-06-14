import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../axiosconfig'

// Thunk to fetch expenses with optional filters
export const fetchExpenses = createAsyncThunk(
  'expenses/fetchExpenses',
  async ({ category, start_date, end_date } = {}, thunkAPI) => {
    try {
      let url = '/expenses/';
      const params = new URLSearchParams();

      if (category) params.append('category', category);
      if (start_date) params.append('start_date', start_date);
      if (end_date) params.append('end_date', end_date);
    
    console.log(`this is params${params}`)
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      console.log(url)
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const expensesSlice = createSlice({
  name: 'expenses',
  initialState: {
    expenses: [],
    loading: false,
    error: null,
    totalAmount: 0
  },
  reducers: {
    deleteExpense: (state, action) => {
      const id = action.payload;
      state.expenses = state.expenses.filter((exp) => exp.id !== id);
    },
    deleteAllExpenses: (state) => {
      state.expenses = [];
    },
    updateExpense: (state, action) => {
      const updated = action.payload;
      const index = state.expenses.findIndex((exp) => exp.id === updated.id);
      if (index !== -1) {
        state.expenses[index] = updated;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
        state.totalAmount = action.payload.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0); 
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export const { deleteExpense, deleteAllExpenses, updateExpense } = expensesSlice.actions;
export default expensesSlice.reducer;
