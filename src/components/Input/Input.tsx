import React, {ChangeEvent, KeyboardEvent, RefObject} from 'react';

type InputPropsType = {
    newTitle: RefObject<HTMLInputElement>
    // onChange: (e: ChangeEvent<HTMLInputElement>) => void
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void
}

export const Input = (props: InputPropsType) => {
    // const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    //     props.onChange(e)
    // }

    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        props.onKeyDown(e)
    }

    return (
        <input ref={props.newTitle}
            // onChange={(e: ChangeEvent<HTMLInputElement>) => onChangeHandler(e)}
               onKeyDown={onKeyDownHandler}/>
    );
};

