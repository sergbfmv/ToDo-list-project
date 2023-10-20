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

export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistType = {
    todolistId: string
    title: string
    filter: FilterValuesType
}
export type TasksStateType = {
    [key: string]: TaskType[]
}

function AppWithReducer() {

    const todolistId1 = v1()
    const todolistId2 = v1()

    const [todolists, dispatchTodolists] = useReducer(todolistsReducer, [
        {todolistId: todolistId1, title: 'What to learn', filter: 'all'},
        {todolistId: todolistId2, title: 'What to buy', filter: 'all'}
    ])

    let [tasks, dispatchTasks] = useReducer(tasksReducer, {
        [todolistId1]: [
            {id: v1(), title: 'CSS&HTML', isDone: true},
            {id: v1(), title: 'JS', isDone: true},
            {id: v1(), title: 'React', isDone: false},
            {id: v1(), title: 'Redux', isDone: false},
            {id: v1(), title: 'MaterialUI', isDone: false},
        ],
        [todolistId2]: [
            {id: v1(), title: 'Milk', isDone: true},
            {id: v1(), title: 'Coffee', isDone: true},
            {id: v1(), title: 'Sugar', isDone: false},
            {id: v1(), title: 'Salt', isDone: false},
            {id: v1(), title: 'Tea', isDone: false},
        ],
    })

    const removeTask = (todolistsId: string, id: string) => {
        dispatchTasks(removeTaskAC(todolistsId, id))
        // setTasks(tasks.filter(t => t.id !== id))
    }

    const addTask = (todolistsId: string, newTitle: string) => {
        dispatchTasks(addTaskAC(todolistsId, newTitle))
    }

    const changeFilter = (todolistId: string, value: FilterValuesType) => {
        dispatchTodolists(changeTodolistFilterAC(todolistId, value))
    }

    const onChangeTask = (todolistsId: string, taskId: string, isDone: boolean) => {
        dispatchTasks(changeTaskStatusAC(todolistsId, taskId, isDone))
    }

    const onChangeTaskTitle = (todolistsId: string, taskId: string, newValue: string) => {
        dispatchTasks(changeTaskTitleAC(todolistsId, taskId, newValue))
    }

    const onChangeTodoTitle = (todolistsId: string, newValue: string) => {
        dispatchTodolists(changeTodolistTitleAC(todolistsId, newValue))
    }

    const removeTodoList = (todolistId: string) => {
        let action = removeTodolistAC(todolistId)
        dispatchTodolists(action)
        dispatchTasks(action)
    }

    const addTodoList = (newTitle: string) => {
        let action = addTodolistAC(newTitle)
        dispatchTodolists(action)
        dispatchTasks(action)
    }

    const mappedTodolists = todolists.map((tl) => {
        const filteredTasks = () => {
            switch (tl.filter) {
                case 'active':
                    return tasks[tl.todolistId].filter(i => !i.isDone)
                case 'completed':
                    return tasks[tl.todolistId].filter(i => i.isDone)
                default:
                    return tasks[tl.todolistId]
            }
        }

        return (
            <Grid item>
                <Paper elevation={5} style={{padding: '20px'}}>
                    <Todolist
                        key={tl.todolistId}
                        todolistId={tl.todolistId}
                        title={tl.title}
                        // tasks={filteredTasks()}
                        // removeTask={removeTask}
                        // addTask={addTask}
                        // changeFilter={changeFilter}
                        // onChangeTask={onChangeTask}
                        filter={tl.filter}
                        removeTodoList={removeTodoList}
                        // onChangeTaskTitle={onChangeTaskTitle}
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

export default AppWithReducer;
