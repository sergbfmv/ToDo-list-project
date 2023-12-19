import { Dispatch } from "redux";
import { todolistAPI, TodolistsType } from "features/TodolistsList/api/todolist-api";
import { FilterValuesType } from "app/AppWithRedux";
import { appActions, RequestStatusType } from "app/app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { tasksThunks } from "features/TodolistsList/tasks-reducer";
import { handleServerAppError, handleServerNetworkError } from "common/utils";

const initialState: TodolistDomainType[] = [];

const slice = createSlice({
  name: "todolists",
  initialState,
  reducers: {
    removeTodolistAC: (state, action: PayloadAction<{ todolistId: string }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.todolistId);
      if (index !== -1) state.splice(index, 1);
    },
    addTodolistAC: (state, action: PayloadAction<{ todolist: TodolistsType }>) => {
      const newTodo: TodolistDomainType = { ...action.payload.todolist, entityStatus: "idle", filter: "all" };
      state.unshift(newTodo);
    },
    changeTodolistTitleAC: (state, action: PayloadAction<{ todolistId: string; title: string }>) => {
      const todo = state.find((todo) => todo.id === action.payload.todolistId);
      if (todo) todo.title = action.payload.title;
    },
    changeTodolistFilterAC: (state, action: PayloadAction<{ todolistId: string; filter: FilterValuesType }>) => {
      const todo = state.find((todo) => todo.id === action.payload.todolistId);
      if (todo) todo.filter = action.payload.filter;
    },
    changeTodolistEntityStatusAC: (state, action: PayloadAction<{ id: string; entityStatus: RequestStatusType }>) => {
      const todo = state.find((todo) => todo.id === action.payload.id);
      if (todo) todo.entityStatus = action.payload.entityStatus;
    },
    setTodolistsAC: (state, action: PayloadAction<{ todos: TodolistsType[] }>) => {
      action.payload.todos.forEach((tl) => {
        state.push({ ...tl, filter: "all", entityStatus: "idle" });
      });
    },
    clearTodosData: (state, action: PayloadAction) => {
      return [];
    },
  },
});

export const todolistsActions = slice.actions;
export const todolistsReducer = slice.reducer;

//TC
export const fetchTodolistsTC = () => (dispatch: any) => {
  dispatch(appActions.setAppStatusAC({ status: "loading" }));
  todolistAPI
    .getTodolists()
    .then((res) => {
      dispatch(todolistsActions.setTodolistsAC({ todos: res.data }));
      dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
      return res.data;
    })
    .then((todos) => {
      todos.forEach((tl) => {
        dispatch(tasksThunks.fetchTasks(tl.id));
      });
    })
    .catch((e) => {
      handleServerAppError(e, dispatch);
    });
};

export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
  dispatch(todolistsActions.changeTodolistEntityStatusAC({ id: todolistId, entityStatus: "loading" }));
  todolistAPI
    .deleteTodolist(todolistId)
    .then((res) => {
      dispatch(todolistsActions.removeTodolistAC({ todolistId: todolistId }));
      dispatch(todolistsActions.changeTodolistEntityStatusAC({ id: todolistId, entityStatus: "succeeded" }));
    })
    .catch((e) => {
      handleServerAppError(e, dispatch);
    });
};

export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
  dispatch(appActions.setAppStatusAC({ status: "loading" }));
  todolistAPI
    .createTodolist(title)
    .then((res) => {
      if (res.data.resultCode === 0) {
        dispatch(todolistsActions.addTodolistAC({ todolist: res.data.data.item }));
        dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((e) => {
      handleServerAppError(e, dispatch);
    });
};

export const changeTodolistTitleTC = (todolistId: string, title: string) => async (dispatch: Dispatch) => {
  dispatch(todolistsActions.changeTodolistEntityStatusAC({ id: todolistId, entityStatus: "loading" }));
  dispatch(appActions.setAppStatusAC({ status: "loading" }));
  try {
    const res = await todolistAPI.changeTodolistTitle(todolistId, title);
    if (res.data.resultCode === 0) {
      dispatch(todolistsActions.changeTodolistTitleAC({ todolistId: todolistId, title: title }));
      dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
      dispatch(todolistsActions.changeTodolistEntityStatusAC({ id: todolistId, entityStatus: "succeeded" }));
    } else {
      handleServerAppError(res.data, dispatch);
      dispatch(todolistsActions.changeTodolistEntityStatusAC({ id: todolistId, entityStatus: "failed" }));
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    dispatch(todolistsActions.changeTodolistEntityStatusAC({ id: todolistId, entityStatus: "failed" }));
  }
};

//Types
export type TodolistDomainType = TodolistsType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
