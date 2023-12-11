import { Dispatch } from "redux";
import { authAPI, LoginParamsType } from "api/todolist-api";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { appActions } from "app/app-reducer";
import { todolistsActions } from "features/TodolistsList/todolists-reducer";

const initialState = {
  isLoggedIn: false,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsLoggedInAC: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
});

export const authActions = slice.actions;
export const authReducer = slice.reducer;

// thunks
export const loginTC = (data: LoginParamsType) => async (dispatch: Dispatch) => {
  dispatch(appActions.setAppStatusAC({ status: "loading" }));
  try {
    const res = await authAPI.login(data);
    if (res.data.resultCode === 0) {
      dispatch(authActions.setIsLoggedInAC({ isLoggedIn: true }));
      dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
    } else {
      handleServerAppError(res.data, dispatch);
      dispatch(appActions.setAppStatusAC({ status: "failed" }));
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
  }
};

export const meTC = () => async (dispatch: Dispatch) => {
  dispatch(appActions.setAppStatusAC({ status: "loading" }));
  try {
    const res = await authAPI.me();
    if (res.data.resultCode === 0) {
      dispatch(authActions.setIsLoggedInAC({ isLoggedIn: true }));
      dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
    } else {
      handleServerAppError(res.data, dispatch);
      dispatch(appActions.setAppStatusAC({ status: "failed" }));
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
  } finally {
    dispatch(appActions.setIsInitializedAC({ isInitialized: true }));
  }
};

export const logoutTC = () => async (dispatch: Dispatch) => {
  dispatch(appActions.setAppStatusAC({ status: "loading" }));
  try {
    const res = await authAPI.logout();
    if (res.data.resultCode === 0) {
      dispatch(authActions.setIsLoggedInAC({ isLoggedIn: false }));
      dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
      dispatch(todolistsActions.clearTodosData());
    } else {
      handleServerAppError(res.data, dispatch);
      dispatch(appActions.setAppStatusAC({ status: "failed" }));
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
  }
};
