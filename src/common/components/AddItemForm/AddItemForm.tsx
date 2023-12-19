import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import { Input } from "common/components/Input/Input";
import Button from "@mui/material/Button";

const addBtnStyle = {
  maxWidth: "38px",
  maxHeight: "38px",
  minWidth: "38px",
  minHeight: "38px",
  marginLeft: "10px",
};

export const AddItemForm = React.memo((props: AddItemFormPropsType) => {
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");

  const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (error !== null) {
      setError(null);
    }
    if (e.key === "Enter") {
      addTaskHandler();
    }
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.currentTarget.value);
  };

  const addTaskHandler = () => {
    if (newTitle.trim() !== "") {
      props.addItem(newTitle.trim());
      setNewTitle("");
    } else {
      setError("Field is required!");
    }
  };

  return (
    <div>
      <Input
        newTitle={newTitle}
        onChange={onChangeHandler}
        onKeyDown={onKeyDownHandler}
        error={error}
        disabled={props.disabled}
      />
      {/*<input onChange={onChangeHandler} value={newTitle} onKeyDown={onKeyDownHandler}/>*/}
      {/*<Button title={'+'} callback={addTaskHandler}/>*/}
      <Button variant="contained" title={"+"} onClick={addTaskHandler} style={addBtnStyle} disabled={props.disabled}>
        +
      </Button>
    </div>
  );
});

//Types
type AddItemFormPropsType = {
  addItem: (newTitle: string) => void;
  disabled?: boolean;
};
