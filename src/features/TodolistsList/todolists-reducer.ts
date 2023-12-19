import { Dispatch } from "redux";
import { todolistAPI, TodolistsType, UpdateTodoArgs } from "features/TodolistsList/api/todolist-api";
import { FilterValuesType } from "app/AppWithRedux";
import { appActions, RequestStatusType } from "app/app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { tasksThunks } from "features/TodolistsList/tasks-reducer";
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from "common/utils";
import { ResultCode } from "common/enums";

const initialState: TodolistDomainType[] = [];

const slice = createSlice({
  name: "todolists",
  initialState,
  reducers: {
    changeTodolistFilterAC: (state, action: PayloadAction<{ todolistId: string; filter: FilterValuesType }>) => {
      const todo = state.find((todo) => todo.id === action.payload.todolistId);
      if (todo) todo.filter = action.payload.filter;
    },
    changeTodolistEntityStatusAC: (state, action: PayloadAction<{ id: string; entityStatus: RequestStatusType }>) => {
      const todo = state.find((todo) => todo.id === action.payload.id);
      if (todo) todo.entityStatus = action.payload.entityStatus;
    },
    clearTodosData: (state, action: PayloadAction) => {
      return [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodolists.fulfilled, (state, action) => {
        action.payload.todos.forEach((tl) => {
          state.push({ ...tl, filter: "all", entityStatus: "idle" });
        });
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const index = state.findIndex((todo) => todo.id === action.payload.todolistId);
        if (index !== -1) state.splice(index, 1);
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        const newTodo: TodolistDomainType = { ...action.payload.todolist, entityStatus: "idle", filter: "all" };
        state.unshift(newTodo);
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const todo = state.find((todo) => todo.id === action.payload.todolistId);
        if (todo) todo.title = action.payload.title;
      });
  },
});

//TC
const fetchTodolists = createAppAsyncThunk<{ todos: TodolistsType[] }>(
  `#${slice.name}/fetchTodolists`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatusAC({ status: "loading" }));
      const res = await todolistAPI.getTodolists();

      dispatch(appActions.setAppStatusAC({ status: "succeeded" }));

      res.data.forEach((tl) => {
        dispatch(tasksThunks.fetchTasks(tl.id));
      });

      return { todos: res.data };
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  },
);

const removeTodolist = createAppAsyncThunk<{ todolistId: string }, { todolistId: string }>(
  `#${slice.name}/removeTodolist`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(todolistsActions.changeTodolistEntityStatusAC({ id: arg.todolistId, entityStatus: "loading" }));

      const res = await todolistAPI.deleteTodolist(arg.todolistId);
      dispatch(todolistsActions.changeTodolistEntityStatusAC({ id: arg.todolistId, entityStatus: "succeeded" }));

      return { todolistId: arg.todolistId };
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  },
);

const addTodolist = createAppAsyncThunk<{ todolist: TodolistsType }, { title: string }>(
  `#${slice.name}/addTodolist`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatusAC({ status: "loading" }));
      const res = await todolistAPI.createTodolist(arg.title);

      if (res.data.resultCode === ResultCode.success) {
        dispatch(appActions.setAppStatusAC({ status: "succeeded" }));

        return { todolist: res.data.data.item };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  },
);

const changeTodolistTitle = createAppAsyncThunk<UpdateTodoArgs, UpdateTodoArgs>(
  `${slice.name}/updateTodolistTitle`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;

    dispatch(todolistsActions.changeTodolistEntityStatusAC({ id: arg.todolistId, entityStatus: "loading" }));
    dispatch(appActions.setAppStatusAC({ status: "loading" }));

    try {
      const res = await todolistAPI.changeTodolistTitle(arg.todolistId, arg.title);
      if (res.data.resultCode === ResultCode.success) {
        dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
        dispatch(todolistsActions.changeTodolistEntityStatusAC({ id: arg.todolistId, entityStatus: "succeeded" }));

        return { todolistId: arg.todolistId, title: arg.title };
      } else {
        handleServerAppError(res.data, dispatch);
        dispatch(todolistsActions.changeTodolistEntityStatusAC({ id: arg.todolistId, entityStatus: "failed" }));
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  },
);

//Types
export type TodolistDomainType = TodolistsType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

export const todolistsActions = slice.actions;
export const todolistsReducer = slice.reducer;
export const todolistsThunks = { fetchTodolists, removeTodolist, addTodolist, changeTodolistTitle };
