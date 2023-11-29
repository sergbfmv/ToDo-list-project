import React, {ChangeEvent, useCallback} from "react";
import {removeTaskAC, removeTaskTC, updateTaskTC} from "../../state/tasks-reducer";
import Checkbox from "@mui/material/Checkbox";
import {EditableSpan} from "../EditableSpan/EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {useDispatch} from "react-redux";
import {TaskStatuses, TaskType} from "../../api/todolist-api";
import {useAppDispatch} from "../../state/store";
import {RequestStatusType} from "../AppWithRedux/app-reducer";


export const Task = React.memo((props: TaskPropsType) => {
    const dispatch = useAppDispatch()


    const removeTaskHandler = useCallback(() => {
        // props.removeTask(props.task.id, props.todolistId)
        const thunk = removeTaskTC(props.todolistId, props.task.id)
        dispatch(thunk)
    }, [props.task.id, props.todolistId]);

    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked
        // props.changeTaskStatus(props.todolistId, props.task.id, newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New)
        const thunk = updateTaskTC(props.todolistId, props.task.id, {status: newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New})
        dispatch(thunk)
    }, [props.task.id, props.todolistId]);

    const onChangeTitleHandler = useCallback((newValue: string) => {
        // props.changeTaskTitle(props.todolistId, props.task.id, newValue)
        const thunk = updateTaskTC(props.todolistId, props.task.id, {title: newValue})
        dispatch(thunk)
    }, [props.task.id, props.todolistId]);


    return (
        <li key={props.task.id} className={props.task.status ? 'task-done' : 'task'}>
            <Checkbox color="success" checked={props.task.status === TaskStatuses.Completed}
                      onChange={onChangeHandler} disabled={props.entityStatus === 'loading'}/>
            {/*<input type="checkbox" checked={t.isDone} onChange={onChangeHandler}/>*/}
            <EditableSpan title={props.task.title} onChange={onChangeTitleHandler}
                          disabled={props.entityStatus === 'loading'}/>
            <IconButton aria-label="delete" onClick={removeTaskHandler} disabled={props.entityStatus === 'loading'}>
                <DeleteIcon/>
            </IconButton>
            {/*<Button title={'x'} callback={removeTaskHandler}/>*/}
        </li>
    )
})


type TaskPropsType = {
    task: TaskType
    todolistId: string
    entityStatus: RequestStatusType
    // changeTaskStatus: (todolistId: string, id: string, status: TaskStatuses) => void
    // changeTaskTitle: (todolistId: string, taskId: string, newTitle: string) => void
    // removeTask: (taskId: string, todolistId: string) => void
}