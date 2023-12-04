import React, {ChangeEvent, useCallback} from 'react'
import {EditableSpan} from '../../../../components/EditableSpan/EditableSpan'
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import {TaskStatuses, TaskType} from "../../../../api/todolist-api";
import {RequestStatusType} from "../../../../components/AppWithRedux/app-reducer";

type TaskPropsType = {
    task: TaskType
    todolistId: string
    changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    removeTask: (taskId: string, todolistId: string) => void
    entityStatus: RequestStatusType
}
export const Task = React.memo((props: TaskPropsType) => {
    const onClickHandler = useCallback(() => props.removeTask(props.task.id, props.todolistId), [props.task.id, props.todolistId]);

    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked
        props.changeTaskStatus(props.task.id, newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New, props.todolistId)
    }, [props.task.id, props.todolistId]);

    const onTitleChangeHandler = useCallback((newValue: string) => {
        props.changeTaskTitle(props.task.id, newValue, props.todolistId)
    }, [props.task.id, props.todolistId]);

    return (
        <li key={props.task.id} className={props.task.status ? 'task-done' : 'task'}>
            <Checkbox color="success" checked={props.task.status === TaskStatuses.Completed}
                      onChange={onChangeHandler} disabled={props.entityStatus === 'loading'}/>
            <EditableSpan title={props.task.title} onChange={onTitleChangeHandler}
                          disabled={props.entityStatus === 'loading'}/>
            <IconButton aria-label="delete" onClick={onClickHandler} disabled={props.entityStatus === 'loading'}>
                <DeleteIcon/>
            </IconButton>
        </li>
    )
})
