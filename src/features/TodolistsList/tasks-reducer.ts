import { Dispatch } from "redux";
import { TasksStateType } from "app/AppWithRedux";
import { appActions, RequestStatusType } from "app/app-reducer";
import { TaskPriorities, TaskStatuses, TaskType, todolistAPI, UpdateTaskModelType } from "api/todolist-api";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { AppRootStateType } from "state/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { todolistsActions } from "features/TodolistsList/todolists-reducer";

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
    addTaskAC: (state, action: PayloadAction<{ task: TaskType }>) => {
      const tasks = state[action.payload.task.todoListId];
      tasks.unshift(action.payload.task);
    },
    updateTaskAC: (
      state,
      action: PayloadAction<{
        taskId: string;
        model: UpdateDomainTaskModelType;
        todolistId: string;
      }>,
    ) => {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((t) => t.id === action.payload.taskId);
      if (index !== -1) {
        tasks[index] = { ...tasks[index], ...action.payload.model };
      }
    },
    getTasksAC: (state, action: PayloadAction<{ tasks: Array<TaskType>; todolistId: string }>) => {
      state[action.payload.todolistId] = action.payload.tasks;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(todolistsActions.addTodolistAC, (state, action) => {
      state[action.payload.todolist.id] = [];
    });
    builder.addCase(todolistsActions.removeTodolistAC, (state, action) => {
      delete state[action.payload.todolistId];
    });
    builder.addCase(todolistsActions.setTodolistsAC, (state, action) => {
      action.payload.todos.forEach((t) => {
        state[t.id] = [];
      });
    });
    builder.addCase(todolistsActions.clearTodosData, (state, action) => {
      return {};
    });
  },
});

export const tasksActions = slice.actions;
export const tasksReducer = slice.reducer;

//TC
export const addTaskTC = (todolistId: string, title: string) => async (dispatch: Dispatch) => {
  dispatch(appActions.setAppStatusAC({ status: "loading" }));
  todolistAPI
    .createTask(todolistId, title)
    .then((res) => {
      if (res.data.resultCode === 0) {
        const task = res.data.data.item;
        dispatch(tasksActions.addTaskAC({ task: task }));
        dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((e) => {
      handleServerAppError(e, dispatch);
    });
};

export const getTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
  dispatch(appActions.setAppStatusAC({ status: "loading" }));
  todolistAPI
    .getTasks(todolistId)
    .then((res) => {
      dispatch(tasksActions.getTasksAC({ todolistId: todolistId, tasks: res.data.items }));
      dispatch(appActions.setAppStatusAC({ status: "succeeded" }));
    })
    .catch((e) => {
      handleServerAppError(e, dispatch);
    });
};

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

export const updateTaskTC =
  (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) =>
  async (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const state = getState();
    const task = state.tasks[todolistId].find((t) => t.id === taskId);

    if (!task) {
      return;
    }

    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      title: task.title,
      priority: TaskPriorities.Low,
      startDate: task.startDate,
      status: task.status,
      ...domainModel,
    };

    dispatch(appActions.setAppStatusAC({ status: "loading" }));
    dispatch(tasksActions.changeTaskEntityStatusAC({ todolistId: todolistId, id: taskId, status: "loading" }));

    todolistAPI
      .updateTask(todolistId, taskId, apiModel)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(tasksActions.updateTaskAC({ todolistId: todolistId, taskId: taskId, model: domainModel }));
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
      })
      .catch((e) => {
        handleServerAppError(e, dispatch);
        dispatch(tasksActions.changeTaskEntityStatusAC({ todolistId: todolistId, id: taskId, status: "failed" }));
      });
  };

//Types
type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
