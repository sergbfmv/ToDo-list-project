import './Todolist.css'
import React, {ChangeEvent} from "react";
import {FilterValuesType} from "../../AppWithRedux";
// import {Button} from "../Button/Button";
import {AddItemForm} from "../AddItemForm/AddItemForm";
import {EditableSpan} from "../EditableSpan/EditableSpan";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import {useDispatch, useSelector} from "react-redux";
import {RootAppStateType} from "../../state/store";
import {TasksStateType} from "../../AppWithRedux";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "../../state/tasks-reducer";
import {changeTodolistFilterAC} from "../../state/todolists-reducer";

export type TaskType = {
    id: string,
    title: string,
    isDone: boolean
}

type TodolistPropsType = {
    todolistId: string
    title: string,
    onChangeTodoTitle: (todolistId: string, value: string) => void
    filter: FilterValuesType
    removeTodoList: (todolistId: string) => void
}
export const Todolist = (props: TodolistPropsType) => {

    const tasks = useSelector<RootAppStateType, TaskType[]>(
        state => state.tasks[props.todolistId])
    const dispatch = useDispatch()


    const changeFilterHandler = (todolistId: string, value: FilterValuesType) => {
        dispatch(changeTodolistFilterAC(props.todolistId, value))
    }

    const addTask = (newTitle: string) => {
        dispatch(addTaskAC(props.todolistId, newTitle))
    }

    const removeTodoList = () => {
        props.removeTodoList(props.todolistId)
    }

    const onChangeTodoTitleHandler = (value: string) => {
        props.onChangeTodoTitle(props.todolistId, value)
    }

    const filteredTasks = () => {
        switch (props.filter) {
            case 'active':
                return tasks.filter(i => !i.isDone)
            case 'completed':
                return tasks.filter(i => i.isDone)
            default:
                return tasks
        }
    }


    const mappedTasks = filteredTasks().map((t) => {
        const removeTaskHandler = () => {
            dispatch(removeTaskAC(props.todolistId, t.id))
        }

        const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
            dispatch(changeTaskStatusAC(props.todolistId, t.id, e.currentTarget.checked))
        }

        const onChangeTitleHandler = (value: string) => {
            dispatch(changeTaskTitleAC(props.todolistId, t.id, value))
        }

        return (
            <li key={t.id} className={t.isDone ? 'task-done' : 'task'}>
                <Checkbox color="success" checked={t.isDone} onChange={onChangeHandler}/>
                {/*<input type="checkbox" checked={t.isDone} onChange={onChangeHandler}/>*/}
                <EditableSpan title={t.title} onChange={onChangeTitleHandler}/>
                <IconButton aria-label="delete" onClick={removeTaskHandler}>
                    <DeleteIcon/>
                </IconButton>
                {/*<Button title={'x'} callback={removeTaskHandler}/>*/}
            </li>
        )
    })

    return (
        <div>
            <h3>
                <EditableSpan title={props.title} onChange={onChangeTodoTitleHandler}/>
                {/*<button onClick={removeTodoList}>x</button>*/}
                <IconButton aria-label="delete" onClick={removeTodoList}>
                    <DeleteIcon/>
                </IconButton>
            </h3>
            {<AddItemForm addItem={addTask}/>}
            <ul>
                {mappedTasks}
                {tasks.length === 0 ? 'Not tasks in the list' : false}
            </ul>
            <div style={{display: 'flex', gap: '10px'}}>
                <Button
                    variant={props.filter === 'all' ? 'contained' : "outlined"}
                    color={'success'}
                    onClick={() => changeFilterHandler(props.todolistId, 'all')}>All</Button>
                <Button
                    variant={props.filter === 'active' ? 'contained' : "outlined"}
                    onClick={() => changeFilterHandler(props.todolistId, 'active')}>Active</Button>
                <Button
                    variant={props.filter === 'completed' ? 'contained' : "outlined"}
                    color={"secondary"}
                    onClick={() => changeFilterHandler(props.todolistId, 'completed')}>Completed</Button>

                {/*<Button active={props.filter === 'all' ? 'active' : 'filterBtn'} title={'All'}*/}
                {/*        callback={() => changeFilterHandler(props.todolistId, 'all')}/>*/}
                {/*<Button active={props.filter === 'active' ? 'active' : 'filterBtn'} title={'Active'}*/}
                {/*        callback={() => changeFilterHandler(props.todolistId, 'active')}/>*/}
                {/*<Button active={props.filter === 'completed' ? 'active' : 'filterBtn'} title={'Completed'}*/}
                {/*        callback={() => changeFilterHandler(props.todolistId, 'completed')}/>*/}
            </div>
        </div>
    )
}

