import {isAxiosError} from 'axios';
import {Dispatch} from 'redux'
import {
    setAppErrorAC, SetAppErrorACType,
    setAppStatusAC, SetAppStatusACType,
} from "../components/AppWithRedux/app-reducer";
import {ResponseType} from "../api/todolist-api";


export const handleServerAppError =
    <T>(data: ResponseType<T>, dispatch: Dispatch) => {
        if (data.messages.length) {
            dispatch(setAppErrorAC(data.messages[0]))
        } else {
            dispatch(setAppErrorAC('Some error'))
        }
        dispatch(setAppStatusAC('failed'))
    }

// export const handleServerNetworkError1 =
//     (message: string, dispatch: Dispatch<ErrorUtilsDispatchType>) => {
//         dispatch(setAppErrorAC(message))
//         dispatch(setAppStatusAC('failed'))
//     }

export const handleServerNetworkError = (e: unknown, dispatch: Dispatch) => {
    if (isAxiosError<ErrorType>(e)) {
        const error = e.response ? e.response.data.messages[0] : e.message
        dispatch(setAppErrorAC(error))
    } else {
        dispatch(setAppErrorAC((e as Error).message))
    }
}

export type ErrorType = {
    "statusCode": number,
    "messages": string[],
    "error": string
}
