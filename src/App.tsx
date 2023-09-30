import React, {useState} from 'react';
import './App.css';
import {TaskType, Todolist} from "./components/Todolist/Todolist";
import {v1} from "uuid";
import {AddItemForm} from "./components/AddItemForm/AddItemForm";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {HeaderAppBar} from "./components/AppBar/AppBar";

export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistsType = {
    todolistId: string
    title: string
    filter: FilterValuesType
}
export type TasksStateType = {
    [key: string]: TaskType[]
}

function App() {

    const todolistId1 = v1()
    const todolistId2 = v1()

    const [todolists, setTodolists] = useState<TodolistsType[]>([
        {todolistId: todolistId1, title: 'What to learn', filter: 'all'},
        {todolistId: todolistId2, title: 'What to buy', filter: 'all'}
    ])

    let [tasks, setTasks] = useState<TasksStateType>({
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
        setTasks({
            ...tasks,
            [todolistsId]: tasks[todolistsId].filter(t => t.id !== id)
        })
        // setTasks(tasks.filter(t => t.id !== id))
    }

    const addTask = (todolistsId: string, newTitle: string) => {
        const newTask = {id: v1(), title: newTitle, isDone: false}
        setTasks({
            ...tasks,
            [todolistsId]: [newTask, ...tasks[todolistsId]]
        })
        // setTasks([newTask, ...tasks])
    }

    const changeFilter = (todolistId: string, value: FilterValuesType) => {
        setTodolists(todolists.map(tl => tl.todolistId === todolistId ? {...tl, filter: value} : tl))
    }


    // const filterTasks = (title: ButtonNameType) => {
    //     setFilteredButton(title)
    // }

    // let filteredTasks = tasks
    //
    // if (filteredButton === 'active') {
    //     filteredTasks = tasks.filter(i => !i.isDone)
    // }
    // if (filteredButton === 'completed') {
    //     filteredTasks = tasks.filter(i => i.isDone)
    // }

    const onChangeTask = (todolistsId: string, taskId: string, isDone: boolean) => {
        setTasks({
            ...tasks,
            [todolistsId]: tasks[todolistsId].map(t => t.id === taskId ? {...t, isDone: isDone} : t)
        })
        // let updateTask = tasks.map(t => t.id === taskId ? {...t, isDone: isDone} : t)
        // setTasks(updateTask)
    }

    const onChangeTaskTitle = (todolistsId: string, taskId: string, newValue: string) => {
        setTasks({
            ...tasks,
            [todolistsId]: tasks[todolistsId].map(t => t.id === taskId ? {...t, title: newValue} : t)
        })
    }

    const onChangeTodoTitle = (todolistsId: string, newValue: string) => {
        setTodolists(todolists.map(tl => tl.todolistId === todolistsId ? {...tl, title: newValue} : tl))
    }

    const removeTodoList = (todolistId: string) => {
        setTodolists(todolists.filter(tl => tl.todolistId !== todolistId))
    }

    const addTodoList = (newTitle: string) => {
        const newTodoList: TodolistsType = {todolistId: v1(), title: newTitle, filter: 'all'}
        setTodolists([newTodoList, ...todolists])
        setTasks({...tasks, [newTodoList.todolistId]: []})
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
                        tasks={filteredTasks()}
                        removeTask={removeTask}
                        addTask={addTask}
                        changeFilter={changeFilter}
                        onChangeTask={onChangeTask}
                        filter={tl.filter}
                        removeTodoList={removeTodoList}
                        onChangeTaskTitle={onChangeTaskTitle}
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

export default App;
