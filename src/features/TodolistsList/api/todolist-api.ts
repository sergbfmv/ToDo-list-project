import { AxiosResponse } from "axios";
import { RequestStatusType } from "app/app-reducer";
import { UpdateDomainTaskModelType } from "features/TodolistsList/tasks-reducer";
import { instance } from "common/api";
import { BaseResponseType } from "common/types";
import { TaskPriorities, TaskStatuses } from "common/enums";

export const todolistAPI = {
  getTodolists() {
    return instance.get<TodolistsType[]>("todo-lists");
  },
  deleteTodolist(todolistId: string) {
    return instance.delete<BaseResponseType>(`/todo-lists/${todolistId}`);
  },
  createTodolist(title: string) {
    return instance.post<BaseResponseType<{ item: TodolistsType }>>("/todo-lists", { title });
  },
  changeTodolistTitle(todolistId: string, title: string) {
    return instance.put<
      null,
      AxiosResponse<BaseResponseType>,
      {
        title: string;
      }
    >(`/todo-lists/${todolistId}`, { title });
  },
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`);
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<BaseResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`);
  },
  createTask(todolistId: string, title: string) {
    return instance.post<
      BaseResponseType<{ item: TaskType }>,
      AxiosResponse<BaseResponseType<{ item: TaskType }>>,
      {
        title: string;
      }
    >(`todo-lists/${todolistId}/tasks`, { title });
  },
  updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
    return instance.put<
      BaseResponseType<{ item: TaskType }>,
      AxiosResponse<
        BaseResponseType<{
          item: TaskType;
        }>
      >,
      UpdateTaskModelType
    >(`todo-lists/${todolistId}/tasks/${taskId}`, model);
  },
};

export type CreateTaskArgs = { todolistId: string; title: string };
export type RemoveTaskArgs = { todolistId: string; taskId: string };
export type UpdateTaskArgs = { taskId: string; domainModel: UpdateDomainTaskModelType; todolistId: string };
export type UpdateTodoArgs = { todolistId: string; title: string };

export type TodolistsType = {
  id: string;
  addedDate: string;
  order: number;
  title: string;
};

export type TaskType = {
  description: string;
  title: string;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
  id: string;
  todoListId: string;
  order: number;
  addedDate: string;
  entityStatus: RequestStatusType;
};

type GetTasksResponse = {
  error: string | null;
  totalCount: number;
  items: TaskType[];
};

export type UpdateTaskModelType = {
  title: string;
  description: string;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
};
