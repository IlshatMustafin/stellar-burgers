import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';

export interface TFeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  userOrders: TOrder[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  userOrders: [],
  isLoading: false,
  error: null
};

export const fetchFeedThunk = createAsyncThunk('feed/fetchFeed', async () => {
  const data = await getFeedsApi();
  return data;
});

export const fetchUserOrdersThunk = createAsyncThunk(
  'feed/fetchUserOrders',
  async () => {
    const data = await getOrdersApi();
    return data;
  }
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFeedThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeedThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки ленты';
      })
      .addCase(fetchUserOrdersThunk.fulfilled, (state, action) => {
        state.userOrders = action.payload;
      });
  }
});

export default feedSlice.reducer;
