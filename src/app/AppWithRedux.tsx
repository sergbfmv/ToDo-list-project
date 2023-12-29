import React, { useEffect } from "react";
import "app/App.css";
import Container from "@mui/material/Container";
import { HeaderAppBar } from "common/components/AppBar/AppBar";
import { useAppSelector } from "app/store";
import { TaskType } from "features/TodolistsList/api/todolist-api";
import { LinearLoader } from "common/components/Loader/LinearLoader";
import { selectAppIsLoggedIn, selectAppStatus, selectIsInitialized } from "app/app-selectors";
import { GlobalError } from "common/components/GlobalError/GlobalError";
import { Navigate, Route, Routes } from "react-router-dom";
import { TodolistsList } from "features/TodolistsList/TodolistsList";
import { Login } from "features/auth/Login";
import CircularProgress from "@mui/material/CircularProgress";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { authThunks } from "features/auth/model/auth-reducers";

function AppWithRedux() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectAppStatus);
  const isInitialized = useAppSelector(selectIsInitialized);
  const isLoggedIn = useAppSelector(selectAppIsLoggedIn);

  useEffect(() => {
    dispatch(authThunks.initializeApp());
  }, []);

  if (!isInitialized) {
    return (
      <div style={{ position: "fixed", top: "30%", textAlign: "center", width: "100%" }}>
        <CircularProgress />
      </div>
    );
  }

  const onClickHandler = () => {
    dispatch(authThunks.logout());
  };

  return (
    <div className="App">
      <GlobalError />
      {status === "loading" && <LinearLoader />}
      <HeaderAppBar isLoggedIn={isLoggedIn} onClickHandler={onClickHandler} />
      <Container fixed>
        <Routes>
          <Route path={"/"} element={<TodolistsList />} />
          <Route path={"/login"} element={<Login />} />
          <Route path={"/404"} element={<h1>404: PAGE NOT FOUND</h1>} />
          <Route path={"*"} element={<Navigate to={"/404"} />} />
        </Routes>
      </Container>
    </div>
  );
}

//Types
export type FilterValuesType = "all" | "active" | "completed";

export type TasksStateType = {
  [key: string]: TaskType[];
};

export default AppWithRedux;
