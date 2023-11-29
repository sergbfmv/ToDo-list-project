import React, {ChangeEvent, useState} from 'react';


export const EditableSpan = React.memo((props: EditableSpanPropsType) => {
    const [editMode, setEditMode] = useState(false)
    const [title, setTitle] = useState('')

    const activateEditMode = () => {
        setEditMode(true)
        setTitle(props.title)
    }

    const activateViewMode = () => {
        setEditMode(false)
        props.onChange(title)
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    return (
        editMode && !props.disabled
            ? <input value={title} onBlur={activateViewMode} onChange={onChangeHandler} autoFocus></input>
            : <span onDoubleClick={activateEditMode}>{props.title}</span>
    );
})


//Types
type EditableSpanPropsType = {
    title: string
    onChange: (value: string) => void
    disabled?: boolean
}
