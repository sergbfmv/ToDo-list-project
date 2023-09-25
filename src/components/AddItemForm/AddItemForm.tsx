import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {Input} from "../Input/Input";
import {Button} from "../Button/Button";

type AddItemFormPropsType = {
    addItem: (newTitle: string) => void
}
export const AddItemForm = (props: AddItemFormPropsType) => {
    const [error, setError] = useState<string | null>(null)
    const [newTitle, setNewTitle] = useState('')

    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        setError(null)
        if (e.key === 'Enter') {
            addTaskHandler()
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTitle(e.currentTarget.value)
    }

    const addTaskHandler = () => {
        if (newTitle.trim() !== '') {
            props.addItem(newTitle.trim())
            setNewTitle('')
        } else {
            setError('Field is required!')
        }
    }

    return (
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
    )
}