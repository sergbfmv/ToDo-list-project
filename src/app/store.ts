import { AnyAction, combineReducers } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { appReducer } from "app/app-reducer";
import { todolistsReducer } from "features/TodolistsList/todolists-reducer";
import { tasksReducer } from "features/TodolistsList/tasks-reducer";
import { authReducer } from "features/auth/model/auth-reducers";
import { configureStore } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  todolists: todolistsReducer,
  tasks: tasksReducer,
  app: appReducer,
  auth: authReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type AppRootStateType = ReturnType<typeof rootReducer>;

export type AppDispatchType = ThunkDispatch<AppRootStateType, unknown, AnyAction>;
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector;

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
