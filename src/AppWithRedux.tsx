import React, {useCallback, useReducer, useState} from 'react';
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

    const dispatch = useDispatch()

    const onChangeTodoTitle = useCallback((todolistsId: string, newValue: string) => {
        dispatch(changeTodolistTitleAC(todolistsId, newValue))
    }, [dispatch])

    const removeTodoList = useCallback((todolistId: string) => {
        let action = removeTodolistAC(todolistId)
        dispatch(action)
    }, [dispatch])

    const addTodoList = useCallback((newTitle: string) => {
        let action = addTodolistAC(newTitle)
        dispatch(action)
    }, [dispatch])

    const mappedTodolists = todolists.map((tl) => {

        return (
            <Grid item key={tl.todolistId}>
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
