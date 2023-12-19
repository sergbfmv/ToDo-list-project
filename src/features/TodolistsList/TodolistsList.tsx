import React, { useCallback, useEffect } from "react";
import { TodolistDomainType, todolistsActions, todolistsThunks } from "./todolists-reducer";
import { tasksThunks } from "./tasks-reducer";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import { Todolist } from "./Todolist/Todolist";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "app/store";
import { FilterValuesType, TasksStateType } from "app/AppWithRedux";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { TaskStatuses } from "common/enums";

export const TodolistsList: React.FC = () => {
  const todolists = useAppSelector<Array<TodolistDomainType>>((state) => state.todolists);
  const tasks = useAppSelector<TasksStateType>((state) => state.tasks);
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    dispatch(todolistsThunks.fetchTodolists());
  }, []);

  const removeTask = useCallback(function (taskId: string, todolistId: string) {
    const thunk = tasksThunks.removeTask({ todolistId, taskId });
    dispatch(thunk);
  }, []);

  const addTask = useCallback(function (title: string, todolistId: string) {
    const thunk = tasksThunks.addTask({ todolistId, title });
    dispatch(thunk);
  }, []);

  const changeStatus = useCallback(function (taskId: string, status: TaskStatuses, todolistId: string) {
    const thunk = tasksThunks.updateTask({ taskId, domainModel: { status }, todolistId });
    dispatch(thunk);
  }, []);

  const changeTaskTitle = useCallback(function (taskId: string, newTitle: string, todolistId: string) {
    const thunk = tasksThunks.updateTask({ taskId, domainModel: { title: newTitle }, todolistId });
    dispatch(thunk);
  }, []);

  const changeFilter = useCallback(function (todolistId: string, value: FilterValuesType) {
    const action = todolistsActions.changeTodolistFilterAC({ todolistId: todolistId, filter: value });
    dispatch(action);
  }, []);

  const removeTodolist = useCallback(function (todolistId: string) {
    const thunk = todolistsThunks.removeTodolist({ todolistId });
    dispatch(thunk);
  }, []);

  const changeTodolistTitle = useCallback(function (todolistId: string, title: string) {
    const thunk = todolistsThunks.changeTodolistTitle({ todolistId, title });
    dispatch(thunk);
  }, []);

  const addTodolist = useCallback(
    (title: string) => {
      const thunk = todolistsThunks.addTodolist({ title });
      dispatch(thunk);
    },
    [dispatch],
  );

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolist} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          let allTodolistTasks = tasks[tl.id];

          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: "10px" }}>
                <Todolist
                  todolist={tl}
                  tasks={allTodolistTasks}
                  removeTask={removeTask}
                  changeFilter={changeFilter}
                  addTask={addTask}
                  changeTaskStatus={changeStatus}
                  removeTodolist={removeTodolist}
                  changeTaskTitle={changeTaskTitle}
                  changeTodolistTitle={changeTodolistTitle}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
