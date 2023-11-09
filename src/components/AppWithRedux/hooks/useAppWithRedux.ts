import {useDispatch, useSelector} from "react-redux";
import {RootAppStateType} from "../../../state/store";
import {useCallback} from "react";
import {addTodolistAC, changeTodolistTitleAC, removeTodolistAC} from "../../../state/todolists-reducer";
import {TodolistType} from "../AppWithRedux";

export const useAppWithRedux = () => {
    const todolists = useSelector<RootAppStateType, TodolistType[]>(state => state.todolists)

    const dispatch = useDispatch()

    const onChangeTodoTitle = useCallback((todolistsId: string, newValue: string) => {
        dispatch(changeTodolistTitleAC(todolistsId, newValue))
    }, [dispatch])

    const removeTodoList = useCallback((todolistId: string) => {
        let action = removeTodolistAC(todolistId)
        dispatch(action)
    }, [dispatch])

    const addTodoList = useCallback((newTitle: string) => {
        let action = addTodolistAC(newTitle)
        dispatch(action)
    }, [dispatch])

    return {
        todolists,
        removeTodoList,
        onChangeTodoTitle,
        addTodoList
    }
}