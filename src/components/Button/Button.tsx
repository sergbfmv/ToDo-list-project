import React from 'react';
import './Button.css'

type BtnPropsType = {
    title: string
    callback: () => void
    active?: string
}
export const Button = (props: BtnPropsType) => {

    const onClickHandler = () => {
        props.callback()
    }

    return (
        <button className={props.active} onClick={onClickHandler}>{props.title}</button>
    );
};

