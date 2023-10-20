import React, {useReducer, useState} from 'react';
import './App.css';
import {TaskType, Todolist} from "./components/Todolist/Todolist";
import {v1} from "uuid";
import {AddItemForm} from "./components/AddItemForm/AddItemForm";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {HeaderAppBar} from "./components/AppBar/AppBar";
import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    todolistsReducer
} from "./state/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./state/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {RootAppStateType} from "./state/store";

export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistType = {
    todolistId: string
    title: string
    filter: FilterValuesType
}
export type TasksStateType = {
    [key: string]: TaskType[]
}

function AppWithRedux() {


    const todolists = useSelector<RootAppStateType, TodolistType[]>(state => state.todolists)
    const tasks = useSelector<RootAppStateType, TasksStateType>(state => state.tasks)
    const dispatch = useDispatch()


    const onChangeTodoTitle = (todolistsId: string, newValue: string) => {
        dispatch(changeTodolistTitleAC(todolistsId, newValue))
    }

    const removeTodoList = (todolistId: string) => {
        let action = removeTodolistAC(todolistId)
        dispatch(action)
    }

    const addTodoList = (newTitle: string) => {
        let action = addTodolistAC(newTitle)
        dispatch(action)
    }

    const mappedTodolists = todolists.map((tl) => {

        return (
            <Grid item>
                <Paper elevation={5} style={{padding: '20px'}}>
                    <Todolist
                        key={tl.todolistId}
                        todolistId={tl.todolistId}
                        title={tl.title}
                        filter={tl.filter}
                        removeTodoList={removeTodoList}
                        onChangeTodoTitle={onChangeTodoTitle}
                    />
                </Paper>
            </Grid>
        )
    })

    return (
        <div className="App">
            <HeaderAppBar/>
            <Container fixed>
                <Grid container style={{padding: '20px'}}>
                    <AddItemForm addItem={addTodoList}/>
                </Grid>
                <Grid container spacing={3}>
                    {mappedTodolists}
                </Grid>
            </Container>
        </div>
    );
}

export default AppWithRedux;
