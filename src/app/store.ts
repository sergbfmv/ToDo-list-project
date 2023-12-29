import { AnyAction, combineReducers } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { appReducer } from "app/app-reducer";
import { todolistsReducer } from "features/TodolistsList/todolists-reducer";
import { tasksReducer } from "features/TodolistsList/tasks-reducer";
import { authReducer } from "features/auth/model/auth-reducers";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    todolists: todolistsReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authReducer,
  },
});

export type AppRootStateType = ReturnType<typeof store.getState>;
export type AppDispatchType = typeof store.dispatch;

// export type AppDispatchType = ThunkDispatch<AppRootStateType, unknown, AnyAction>;
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector;

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
