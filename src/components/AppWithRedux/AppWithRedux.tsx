import React, {useEffect} from 'react';
import '../../App.css';
import Container from '@mui/material/Container';
import {HeaderAppBar} from "../AppBar/AppBar";
import {useAppDispatch, useAppSelector} from "../../state/store";
import {TaskType} from "../../api/todolist-api";
import {LinearLoader} from "../Loader/LinearLoader";
import {selectAppIsLoggedIn, selectAppStatus, selectIsInitialized} from "./app-selectors";
import {GlobalError} from "../GlobalError/GlobalError";
import {Navigate, Route, Routes} from "react-router-dom";
import {TodolistsList} from "../../features/TodolistsList/TodolistsList";
import {Login} from "../../features/Login/Login";
import {logoutTC, meTC} from "../../features/Login/auth-reducers";
import CircularProgress from "@mui/material/CircularProgress";


function AppWithRedux() {
    const dispatch = useAppDispatch()
    const status = useAppSelector(selectAppStatus)
    const isInitialized = useAppSelector(selectIsInitialized)
    const isLoggedIn = useAppSelector(selectAppIsLoggedIn)

    useEffect(() => {
        dispatch(meTC())
    }, []);

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    const onClickHandler = () => {
        dispatch(logoutTC())
    }

    return (
        <div className="App">
            <GlobalError/>
            {status === 'loading' && <LinearLoader/>}
            <HeaderAppBar isLoggedIn={isLoggedIn} onClickHandler={onClickHandler}/>
            <Container fixed>
                <Routes>
                    <Route path={'/'} element={<TodolistsList/>}/>
                    <Route path={'/login'} element={<Login/>}/>
                    <Route path={'/404'} element={<h1>404: PAGE NOT FOUND</h1>}/>
                    <Route path={'*'} element={<Navigate to={'/404'}/>}/>
                </Routes>
            </Container>
        </div>
    );
}


//Types
export type FilterValuesType = 'all' | 'active' | 'completed'

export type TasksStateType = {
    [key: string]: TaskType[]
}

export default AppWithRedux;
