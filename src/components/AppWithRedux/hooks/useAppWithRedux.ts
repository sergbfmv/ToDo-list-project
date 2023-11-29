import {useAppDispatch, useAppSelector} from "../../../state/store";
import {useCallback} from "react";
import {addTodolistTC, changeTodolistTitleTC, deleteTodolistTC,} from "../../../state/todolists-reducer";


export const useAppWithRedux = () => {
    const todolists = useAppSelector(state => state.todolists)

    const dispatch = useAppDispatch()

    const onChangeTodoTitle = useCallback((todolistsId: string, newValue: string) => {
        dispatch(changeTodolistTitleTC(todolistsId, newValue))
    }, [dispatch])

    const removeTodoList = useCallback((todolistId: string) => {
        dispatch(deleteTodolistTC(todolistId))
    }, [dispatch])

    const addTodoList = useCallback((newTitle: string) => {
        dispatch(addTodolistTC(newTitle))
    }, [dispatch])

    return {
        todolists,
        removeTodoList,
        onChangeTodoTitle,
        addTodoList
    }
}