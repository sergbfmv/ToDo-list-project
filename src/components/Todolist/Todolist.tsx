import './Todolist.css'
import React, {useCallback} from "react";
import {FilterValuesType} from "../../AppWithRedux";
import {AddItemForm} from "../AddItemForm/AddItemForm";
import {EditableSpan} from "../EditableSpan/EditableSpan";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import {useDispatch, useSelector} from "react-redux";
import {RootAppStateType} from "../../state/store";
import {addTaskAC} from "../../state/tasks-reducer";
import {changeTodolistFilterAC} from "../../state/todolists-reducer";
import {Task} from "../Task/Task";

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
export const Todolist = React.memo((props: TodolistPropsType) => {

    const tasks = useSelector<RootAppStateType, TaskType[]>(
        state => state.tasks[props.todolistId])
    const dispatch = useDispatch()


    const changeFilterHandler = useCallback((todolistId: string, value: FilterValuesType) => {
        dispatch(changeTodolistFilterAC(props.todolistId, value))
    }, [dispatch])

    const addTask = useCallback((newTitle: string) => {
        dispatch(addTaskAC(props.todolistId, newTitle))
    }, [dispatch])

    const removeTodoList = useCallback(() => {
        props.removeTodoList(props.todolistId)
    }, [props.removeTodoList, props.todolistId])

    const onChangeTodoTitleHandler = useCallback((value: string) => {
        props.onChangeTodoTitle(props.todolistId, value)
    }, [props.onChangeTodoTitle, props.todolistId])


    let filteredTasks = tasks

    if (props.filter === 'active') {
        filteredTasks = tasks.filter(i => !i.isDone)
    } else if (props.filter === 'completed') {
        filteredTasks = tasks.filter(i => i.isDone)
    }


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
                {filteredTasks.map(t => {
                    return (
                        <Task key={t.id} task={t} todolistId={props.todolistId}/>
                    )
                })}
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
})

