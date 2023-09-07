import './Todolist.css'
import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {FilterValuesType} from "../../App";
import {Button} from "../Button/Button";
import {Input} from "../Input/Input";

type TaskType = {
    id: string,
    title: string,
    isDone: boolean
}

type TodolistPropsType = {
    title: string,
    tasks: TaskType[]
    removeTask: (tasId: string) => void
    addTask: (newTitle: string) => void
    changeFilter: (value: FilterValuesType) => void
    onChangeTask: (taskId: string, isDone: boolean) => void
    filter: FilterValuesType
}
export const Todolist = (props: TodolistPropsType) => {

    const [newTitle, setNewTitle] = useState('')
    const [error, setError] = useState<string | null>(null)

    const changeFilterHandler = (value: FilterValuesType) => {
        props.changeFilter(value)
    }

    const mappedTasks = props.tasks.map((t) => {
        const removeTaskHandler = () => {
            props.removeTask(t.id)
        }

        const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
            props.onChangeTask(t.id, e.currentTarget.checked)
        }

        return (
            <li key={t.id} className={t.isDone ? 'task-done' : 'task'}>
                <input type="checkbox" checked={t.isDone} onChange={onChangeHandler}/>
                <span>{t.title}</span>
                <Button title={'x'} callback={removeTaskHandler}/>
            </li>
        )
    })

    const addTaskHandler = () => {
        if (newTitle.trim() !== '') {
            props.addTask(newTitle.trim())
            setNewTitle('')
        } else {
            setError('Field is required!')
        }
    }

    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        setError(null)
        if (e.key === 'Enter') {
            addTaskHandler()
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTitle(e.currentTarget.value)
    }

    return (
        <div>
            <h3>{props.title}</h3>
            <div>
                <Input newTitle={newTitle}
                       onChange={onChangeHandler}
                       onKeyDown={onKeyDownHandler}
                       error={error}
                />
                {/*<input onChange={onChangeHandler} value={newTitle} onKeyDown={onKeyDownHandler}/>*/}
                <Button title={'+'} callback={addTaskHandler}/>
                {error ? <div className='error-text'>{error}</div> : ''}
            </div>
            <ul>
                {mappedTasks}
                {props.tasks.length === 0 ? 'Not tasks in the list' : false}
            </ul>
            <div>
                <Button active={props.filter === 'all' ? 'active' : 'filterBtn'} title={'All'}
                        callback={() => changeFilterHandler('all')}/>
                <Button active={props.filter === 'active' ? 'active' : 'filterBtn'} title={'Active'}
                        callback={() => changeFilterHandler('active')}/>
                <Button active={props.filter === 'completed' ? 'active' : 'filterBtn'} title={'Completed'}
                        callback={() => changeFilterHandler('completed')}/>
            </div>
        </div>
    )
}