import { AxiosResponse } from "axios";
import { RequestStatusType } from "app/app-reducer";
import { UpdateDomainTaskModelType } from "features/TodolistsList/tasks-reducer";
import { instance } from "common/api";
import { ResponseType } from "common/types";

export const todolistAPI = {
  getTodolists() {
    return instance.get<TodolistsType[]>("todo-lists");
  },
  deleteTodolist(todolistId: string) {
    return instance.delete<ResponseType>(`/todo-lists/${todolistId}`);
  },
  createTodolist(title: string) {
    return instance.post<ResponseType<{ item: TodolistsType }>>("/todo-lists", { title });
  },
  changeTodolistTitle(todolistId: string, title: string) {
    return instance.put<null, AxiosResponse<ResponseType>, { title: string }>(`/todo-lists/${todolistId}`, { title });
  },
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`);
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`);
  },
  createTask(todolistId: string, title: string) {
    return instance.post<
      ResponseType<{ item: TaskType }>,
      AxiosResponse<ResponseType<{ item: TaskType }>>,
      {
        title: string;
      }
    >(`todo-lists/${todolistId}/tasks`, { title });
  },
  updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
    return instance.put<
      ResponseType<{ item: TaskType }>,
      AxiosResponse<
        ResponseType<{
          item: TaskType;
        }>
      >,
      UpdateTaskModelType
    >(`todo-lists/${todolistId}/tasks/${taskId}`, model);
  },
};

export type CreateTaskArgs = { todolistId: string; title: string };
export type UpdateTaskArgs = { taskId: string; domainModel: UpdateDomainTaskModelType; todolistId: string };

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

export enum TaskStatuses {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Draft = 3,
}

export enum TaskPriorities {
  Low = 0,
  Middle = 1,
  Hi = 2,
  Urgently = 3,
  Later = 4,
}

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
