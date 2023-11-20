import React, {useEffect} from 'react';
import '../../App.css';
import {Todolist} from "../Todolist/Todolist";
import {AddItemForm} from "../AddItemForm/AddItemForm";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {HeaderAppBar} from "../AppBar/AppBar";
import {getTodolistsTC} from "../../state/todolists-reducer";
import {useAppDispatch} from "../../state/store";
import {useAppWithRedux} from "./hooks/useAppWithRedux";
import {TaskType} from "../../api/todolist-api";


function AppWithRedux() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getTodolistsTC())
    }, []);

    const {
        todolists,
        removeTodoList,
        onChangeTodoTitle,
        addTodoList

    } = useAppWithRedux()

    const mappedTodolists = todolists.map((tl) => {

        return (
            <Grid item key={tl.id}>
                <Paper elevation={5} style={{padding: '20px'}}>
                    <Todolist
                        key={tl.id}
                        todolistId={tl.id}
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


//Types
export type FilterValuesType = 'all' | 'active' | 'completed'

export type TasksStateType = {
    [key: string]: TaskType[]
}

export default AppWithRedux;
