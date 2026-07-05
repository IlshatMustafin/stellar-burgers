import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  loginUserApi,
  getUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
  TLoginData,
  TRegisterData
} from '../../utils/burger-api';
import { TUser } from '../../utils/types';
import { setCookie } from '../../utils/cookie';

type TLoginResponse = {
  refreshToken: string;
  accessToken: string;
  user: TUser;
};

export interface UserState {
  isInit: boolean;
  isLoading: boolean;
  user: TUser | null;
  error: string | null;
}

const initialState: UserState = {
  isInit: false,
  isLoading: false,
  user: null,
  error: null
};

export const registerUserThunk = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const res = await registerUserApi(data);
      return res;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const loginUserThunk = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      const res = await loginUserApi(data);
      return res as TLoginResponse;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getUserThunk = createAsyncThunk(
  'user/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUserApi();
      return res.user;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateUserThunk = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const res = await updateUserApi(data);
      return res.user;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const logoutUserThunk = createAsyncThunk(
  'user/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      localStorage.removeItem('refreshToken');
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    init: (state) => {
      state.isInit = true;
    },
    logout: (state) => {
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        registerUserThunk.fulfilled,
        (state, action: PayloadAction<TLoginResponse>) => {
          state.isLoading = false;
          state.user = action.payload.user;
          state.isInit = true;
          localStorage.setItem('refreshToken', action.payload.refreshToken);
          setCookie('accessToken', action.payload.accessToken);
        }
      )
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as { message: string })?.message ||
          'Ошибка регистрации';
      })

      .addCase(loginUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        loginUserThunk.fulfilled,
        (state, action: PayloadAction<TLoginResponse>) => {
          state.isLoading = false;
          state.user = action.payload.user;
          state.isInit = true;
          localStorage.setItem('refreshToken', action.payload.refreshToken);
          setCookie('accessToken', action.payload.accessToken);
        }
      )
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as { message: string })?.message || 'Ошибка входа';
        state.isInit = true;
      })
      .addCase(getUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getUserThunk.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.isLoading = false;
          state.user = action.payload;
          state.isInit = true;
        }
      )
      .addCase(getUserThunk.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isInit = true;
      })
      .addCase(updateUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        updateUserThunk.fulfilled,
        (state, action: PayloadAction<TUser>) => {
          state.isLoading = false;
          state.user = action.payload;
        }
      )
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as { message: string })?.message ||
          'Ошибка обновления данных';
      });
  }
});

export const { init, logout } = userSlice.actions;
export default userSlice.reducer;
