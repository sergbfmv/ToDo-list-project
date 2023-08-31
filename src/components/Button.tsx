import React from 'react';

type BtnPropsType = {
    title: string
    callback: () => void
}
export const Button = (props: BtnPropsType) => {

    const onClickHandler = () => {
        props.callback()
    }

    return (
        <button onClick={onClickHandler}>{props.title}</button>
    );
};

