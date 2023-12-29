import { AppDispatchType, AppRootStateType } from 'app/store';
import { BaseThunkAPI } from '@reduxjs/toolkit/dist/createAsyncThunk';
import { handleServerNetworkError } from "./handleServerNetworkError";
import { appActions } from "../../app/app-reducer";
import { BaseResponseType } from "../types";

export const thunkTryCatch = async <T>(
  thunkAPI: BaseThunkAPI<AppRootStateType, unknown, AppDispatchType, null | BaseResponseType>,
  logic: () => Promise<T>
): Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>> => {
  const { dispatch, rejectWithValue } = thunkAPI;
  dispatch(appActions.setAppStatusAC({ status: "loading" }));
  try {
    return await logic();
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  } finally {
    dispatch(appActions.setAppStatusAC({ status: "idle" }));
  }
};