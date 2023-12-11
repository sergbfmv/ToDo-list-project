import { TasksStateType } from "app/AppWithRedux";
import { TodolistDomainType, todolistsActions, todolistsReducer } from "features/TodolistsList/todolists-reducer";
import { TodolistsType } from "api/todolist-api";
import { tasksReducer } from "features/TodolistsList/tasks-reducer";

test("ids should be equals", () => {
  const startTasksState: TasksStateType = {};
  const startTodolistsState: Array<TodolistDomainType> = [];

  let todolist: TodolistsType = {
    title: "new todolist",
    id: "any id",
    addedDate: "",
    order: 0,
  };

  const action = todolistsActions.addTodolistAC({ todolist });

  const endTasksState = tasksReducer(startTasksState, action);
  const endTodolistsState = todolistsReducer(startTodolistsState, action);

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodolists = endTodolistsState[0].id;

  expect(idFromTasks).toBe(action.payload.todolist.id);
  expect(idFromTodolists).toBe(action.payload.todolist.id);
});
