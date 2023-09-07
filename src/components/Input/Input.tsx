import React, {ChangeEvent, KeyboardEvent} from 'react';
import './Input.css'

type InputPropsType = {
    newTitle: string
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void
    error: string | null
}

export const Input = (props: InputPropsType) => {
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        props.onChange(e)
    }

    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        props.onKeyDown(e)
    }

    return (
        <input
            className={props.error ? 'empty-value-error' : ''}
            value={props.newTitle}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChangeHandler(e)}
            onKeyDown={onKeyDownHandler}/>
    );
};

