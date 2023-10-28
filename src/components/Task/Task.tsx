import React, {ChangeEvent, useCallback} from "react";
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "../../state/tasks-reducer";
import Checkbox from "@mui/material/Checkbox";
import {EditableSpan} from "../EditableSpan/EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {TaskType} from "../Todolist/Todolist";
import {useDispatch} from "react-redux";

type TaskPropsType = {
    key: string
    todolistId: string
    task: TaskType
}

export const Task = React.memo((props: TaskPropsType) => {
    const dispatch = useDispatch()

    const removeTaskHandler = useCallback(() => {
        dispatch(removeTaskAC(props.todolistId, props.task.id))
    }, [dispatch])

    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        dispatch(changeTaskStatusAC(props.todolistId, props.task.id, e.currentTarget.checked))
    }, [dispatch])

    const onChangeTitleHandler = useCallback((value: string) => {
        dispatch(changeTaskTitleAC(props.todolistId, props.task.id, value))
    }, [dispatch])

    return (
        <li key={props.task.id} className={props.task.isDone ? 'task-done' : 'task'}>
            <Checkbox color="success" checked={props.task.isDone} onChange={onChangeHandler}/>
            {/*<input type="checkbox" checked={t.isDone} onChange={onChangeHandler}/>*/}
            <EditableSpan title={props.task.title} onChange={onChangeTitleHandler}/>
            <IconButton aria-label="delete" onClick={removeTaskHandler}>
                <DeleteIcon/>
            </IconButton>
            {/*<Button title={'x'} callback={removeTaskHandler}/>*/}
        </li>
    )
})