import { Dispatch } from "redux";
import { TasksStateType } from "app/AppWithRedux";
import { appActions, RequestStatusType } from "app/app-reducer";
import {
  CreateTaskArgs,
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistAPI,
  UpdateTaskArgs,
  UpdateTaskModelType,
} from "features/TodolistsList/api/todolist-api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { todolistsActions } from "features/TodolistsList/todolists-reducer";
import { createAppAsyncThunk } from "common/utils/create-app-async-thunk";
import { handleServerAppError, handleServerNetworkError } from "common/utils";

const initialState: TasksStateType = {};

const slice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    changeTaskEntityStatusAC: (
      state,
      action: PayloadAction<{
        todolistId: string;
        id: string;
        status: RequestStatusType;
      }>,
    ) => {
      const todo = state[action.payload.todolistId].find((todo) => todo.id === action.payload.id);
      if (todo) todo.entityStatus = action.payload.status;
    },
    removeTaskAC: (state, action: PayloadAction<{ taskId: string; todolistId: string }>) => {
      const tasksFotTodolist = state[action.payload.todolistId];
      const index = tasksFotTodolist.findIndex((task) => task.id === action.payload.taskId);
      if (index !== -1) {
        tasksFotTodolist.splice(index, 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.task.todoListId];
        tasks.unshift(action.payload.task);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId];
        const index = tasks.findIndex((t) => t.id === action.payload.taskId);
        if (index !== -1) {
          tasks[index] = { ...tasks[index], ...action.payload.domainModel };
        }
      })
      .addCase(todolistsActions.addTodolistAC, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(todolistsActions.removeTodolistAC, (state, action) => {
        delete state[action.payload.todolistId];
      })
      .addCase(todolistsActions.setTodolistsAC, (state, action) => {
        action.payload.todos.forEach((t) => {
          state[t.id] = [];
        });
      })
      .addCase(todolistsActions.clearTodosData, (state, action) => {
        return {};
      });
  },
});

//TC
const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
  `${slice.name}/fetchTasks`,
  async (todolistId: string, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;

    try {
      dispatch(appActions.setAppStatusAC({ status: "loading" }));
      const res = await todolistAPI.getTasks(todolistId);
      const tasks = res.data.items;
      dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
      return { tasks, todolistId };
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  },
);

const addTask = createAppAsyncThunk<{ task: TaskType }, CreateTaskArgs>(
  `${slice.name}/addTask`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;

    try {
      dispatch(appActions.setAppStatusAC({ status: "loading" }));
      const res = await todolistAPI.createTask(arg.todolistId, arg.title);

      if (res.data.resultCode === 0) {
        const task = res.data.data.item;
        dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
        return { task: task };
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

export const removeTaskTC = (todolistId: string, taskId: string) => async (dispatch: Dispatch) => {
  dispatch(appActions.setAppStatusAC({ status: "loading" }));
  dispatch(tasksActions.changeTaskEntityStatusAC({ todolistId: todolistId, id: taskId, status: "loading" }));
  try {
    const res = await todolistAPI.deleteTask(todolistId, taskId);

    if (res.data.resultCode === 0) {
      dispatch(tasksActions.removeTaskAC({ todolistId: todolistId, taskId: taskId }));
      dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
      dispatch(
        tasksActions.changeTaskEntityStatusAC({
          todolistId: todolistId,
          id: taskId,
          status: "succeeded",
        }),
      );
    } else {
      handleServerAppError(res.data, dispatch);
      dispatch(tasksActions.changeTaskEntityStatusAC({ todolistId: todolistId, id: taskId, status: "failed" }));
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    dispatch(tasksActions.changeTaskEntityStatusAC({ todolistId: todolistId, id: taskId, status: "failed" }));
  }
};

const updateTask = createAppAsyncThunk<UpdateTaskArgs, UpdateTaskArgs>(
  `${slice.name}/updateTask`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue, getState } = thunkAPI;

    try {
      const state = getState();
      const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId);

      if (!task) {
        return rejectWithValue(null);
      }

      const apiModel: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        title: task.title,
        priority: TaskPriorities.Low,
        startDate: task.startDate,
        status: task.status,
        ...arg.domainModel,
      };

      dispatch(appActions.setAppStatusAC({ status: "loading" }));
      dispatch(
        tasksActions.changeTaskEntityStatusAC({
          todolistId: arg.todolistId,
          id: arg.taskId,
          status: "loading",
        }),
      );

      const res = await todolistAPI.updateTask(arg.todolistId, arg.taskId, apiModel);

      if (res.data.resultCode === 0) {
        dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
        dispatch(
          tasksActions.changeTaskEntityStatusAC({
            todolistId: arg.todolistId,
            id: arg.taskId,
            status: "failed",
          }),
        );

        return arg;
      } else {
        handleServerAppError(res.data, dispatch);
        dispatch(
          tasksActions.changeTaskEntityStatusAC({
            todolistId: arg.todolistId,
            id: arg.taskId,
            status: "failed",
          }),
        );
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      dispatch(tasksActions.changeTaskEntityStatusAC({ todolistId: arg.todolistId, id: arg.taskId, status: "failed" }));
      return rejectWithValue(null);
    }
  },
);

//Types
export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};

export const tasksActions = slice.actions;
export const tasksReducer = slice.reducer;
export const tasksThunks = { fetchTasks, addTask, updateTask };
