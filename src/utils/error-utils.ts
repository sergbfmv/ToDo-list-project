import {Dispatch} from 'redux'
import {ResponseType} from '../api/todolist-api'
import {
    setAppErrorAC,
    SetAppErrorACType,
    setAppStatusAC,
    SetAppStatusACType
} from "../components/AppWithRedux/app-reducer";

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: ErrorUtilsDispatchType) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]))
    } else {
        dispatch(setAppErrorAC('Some error occurred'))
    }
    dispatch(setAppStatusAC('failed'))
}

export const handleServerNetworkError = (message: string, dispatch: ErrorUtilsDispatchType) => {
    dispatch(setAppErrorAC(message))
    dispatch(setAppStatusAC('failed'))
}

type ErrorUtilsDispatchType = Dispatch<SetAppErrorACType | SetAppStatusACType>

