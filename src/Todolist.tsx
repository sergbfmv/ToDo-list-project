import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {FilterValuesType} from "./App";
import {Button} from "./components/Button";

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
}
export const Todolist = (props: TodolistPropsType) => {

    const [newTitle, setNewTitle] = useState('')

    const changeFilterHandler = (value: FilterValuesType) => {
        props.changeFilter(value)
    }

    const mappedTasks = props.tasks.map((t) => {
        const removeTaskHandler = () => {
            props.removeTask(t.id)
        }

        return (
            <li key={t.id}>
                <Button title={'x'} callback={removeTaskHandler} />
                <input type="checkbox" checked={t.isDone}/>
                <span>{t.title}</span>
            </li>
        )
    })

    const addTaskHandler = () => {
        if (newTitle !== '') {
            props.addTask(newTitle)
            setNewTitle('')
        }
    }

    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
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
                <input onChange={onChangeHandler} value={newTitle} onKeyDown={onKeyDownHandler}/>
                <Button title={'+'} callback={addTaskHandler} />
            </div>
            <ul>
                {mappedTasks}
            </ul>
            <div>
                <Button title={'All'} callback={() => changeFilterHandler('all')} />
                <Button title={'Active'} callback={() => changeFilterHandler('active')} />
                <Button title={'Completed'} callback={() => changeFilterHandler('completed')} />
            </div>
        </div>
    )
}