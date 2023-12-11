import React, { ChangeEvent, KeyboardEvent } from "react";
import "./Input.css";
import TextField from "@mui/material/TextField";

export const Input = (props: InputPropsType) => {
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    props.onChange(e);
  };

  const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    props.onKeyDown(e);
  };

  return (
    <TextField
      id="outlined-basic"
      label={props.error ? props.error : "Type anything..."}
      size="small"
      variant="outlined"
      error={!!props.error}
      value={props.newTitle}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChangeHandler(e)}
      onKeyDown={onKeyDownHandler}
      className={props.error ? "error" : ""}
      disabled={props.disabled}
    />
    // <input
    //     className={props.error ? 'empty-value-error' : ''}
    //     value={props.newTitle}
    //     onChange={(e: ChangeEvent<HTMLInputElement>) => onChangeHandler(e)}
    //     onKeyDown={onKeyDownHandler}/>
  );
};

//Types
type InputPropsType = {
  newTitle: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  error: string | null;
  disabled?: boolean;
};
