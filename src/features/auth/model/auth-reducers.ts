import { Dispatch } from "redux";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { appActions } from "app/app-reducer";
import { todolistsActions } from "features/TodolistsList/todolists-reducer";
import { LoginParamsType } from "features/auth/api/auth-api.types";
import { authAPI } from "features/auth/api/auth-api";
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from "common/utils";
import { ResultCode } from "common/enums";

const initialState = {
  isLoggedIn: false,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(initializeApp.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      });
  },
});

// thunks
const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>(
  `${slice.name}/login`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;

    dispatch(appActions.setAppStatusAC({ status: "loading" }));

    try {
      const res = await authAPI.login(arg);
      if (res.data.resultCode === ResultCode.success) {
        dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
        return { isLoggedIn: true };
      } else {
        handleServerAppError(res.data, dispatch);
        dispatch(appActions.setAppStatusAC({ status: "failed" }));
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  },
);

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
  `${slice.name}/logout`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;

    dispatch(appActions.setAppStatusAC({ status: "loading" }));

    try {
      const res = await authAPI.logout();
      if (res.data.resultCode === ResultCode.success) {
        dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
        dispatch(todolistsActions.clearTodosData());
        return { isLoggedIn: false };
      } else {
        // ❗ Если у нас fieldsErrors есть значит мы будем отображать эти ошибки
        // в конкретном поле в компоненте (пункт 7)
        // ❗ Если у нас fieldsErrors нету значит отобразим ошибку глобально
        const isShowAppError = !res.data.fieldsErrors.length;
        handleServerAppError(res.data, dispatch, isShowAppError);
        dispatch(appActions.setAppStatusAC({ status: "failed" }));
        return rejectWithValue(res.data);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  },
);

const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
  `${slice.name}/initializeApp`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(appActions.setAppStatusAC({ status: "loading" }));

    try {
      const res = await authAPI.me();
      if (res.data.resultCode === 0) {
        dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
        return { isLoggedIn: true };
      } else {
        handleServerAppError(res.data, dispatch);
        dispatch(appActions.setAppStatusAC({ status: "failed" }));
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    } finally {
      dispatch(appActions.setIsInitializedAC({ isInitialized: true }));
    }
  },
);

export const authActions = slice.actions;
export const authReducer = slice.reducer;
export const authThunks = { login, logout, initializeApp };
