import React, {useCallback, useReducer, useState} from 'react';
import '../../App.css';
import {TaskType, Todolist} from "../Todolist/Todolist";
import {v1} from "uuid";
import {AddItemForm} from "../AddItemForm/AddItemForm";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {HeaderAppBar} from "../AppBar/AppBar";
import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    todolistsReducer
} from "../../state/todolists-reducer";
import {useDispatch, useSelector} from "react-redux";
import {RootAppStateType} from "../../state/store";
import {useAppWithRedux} from "./hooks/useAppWithRedux";

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

    const {
        todolists,
        removeTodoList,
        onChangeTodoTitle,
        addTodoList

    } = useAppWithRedux()

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
