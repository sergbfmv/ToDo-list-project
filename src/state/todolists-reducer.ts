import {FilterValuesType} from "../components/AppWithRedux/AppWithRedux";
import {Dispatch} from "redux";
import {TaskType, todolistAPI, TodolistsType} from "../api/todolist-api";
import {RequestStatusType, setAppErrorAC, setAppStatusAC} from "../components/AppWithRedux/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import axios from "axios/index";
import {ErrorType} from "./tasks-reducer";


const initialState: TodolistDomainType[] = []

export const todolistsReducer = (state: TodolistDomainType[] = initialState, action: ActionsType): TodolistDomainType[] => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id !== action.payload.todolistId)
        }
        case 'ADD-TODOLIST': {
            const newTodo: TodolistDomainType = {...action.payload.todolist, entityStatus: 'idle', filter: 'all'}
            return [newTodo, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            return state.map(tl => tl.id === action.payload.todolistId ? {
                ...tl,
                title: action.payload.title
            } : tl)
        }
        case 'CHANGE-TODOLIST-FILTER': {
            return state.map(tl => tl.id === action.payload.todolistId ? {
                ...tl,
                filter: action.payload.filter
            } : tl)
        }
        case "SET-TODOLISTS": {
            return action.payload.todos.map(tl => ({...tl, entityStatus: 'idle', filter: 'all'}))
        }
        case "CHANGE-ENTITY-STATUS": {
            return state.map(tl => tl.id === action.id ? {...tl, entityStatus: action.entityStatus} : tl)
        }
        default:
            return state
    }
}


//AC
export const removeTodolistAC = (todolistId: string) => {
    return {
        type: 'REMOVE-TODOLIST',
        payload: {
            todolistId
        }
    } as const
}

export const addTodolistAC = (todolist: TodolistsType) => {
    return {
        type: 'ADD-TODOLIST',
        payload: {
            todolist
        }
    } as const
}

export const changeTodolistTitleAC = (todolistId: string, title: string) => {
    return {
        type: 'CHANGE-TODOLIST-TITLE',
        payload: {
            todolistId,
            title
        }
    } as const
}

export const changeTodolistFilterAC = (todolistId: string, filter: FilterValuesType) => {
    return {
        type: 'CHANGE-TODOLIST-FILTER',
        payload: {
            todolistId,
            filter
        }
    } as const
}

export const setTodolistsAC = (todos: TodolistsType[]) => {
    return {
        type: 'SET-TODOLISTS',
        payload: {
            todos
        }
    } as const
}

export const changeTodolistEntityStatusAC = (id: string, entityStatus: RequestStatusType) => ({
    type: 'CHANGE-ENTITY-STATUS',
    id,
    entityStatus
} as const)


//TC
export const getTodolistsTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistAPI.getTodolists()
        .then((res) => {
            dispatch(setTodolistsAC(res.data))
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch(e => {
            handleServerAppError(e, dispatch)
        })
}

export const deleteTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'))
    todolistAPI.deleteTodolist(todolistId)
        .then(res => {
            dispatch(removeTodolistAC(todolistId))
            dispatch(changeTodolistEntityStatusAC(todolistId, 'succeeded'))
        })
        .catch(e => {
            handleServerAppError(e, dispatch)
        })
}

export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistAPI.createTodolist(title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTodolistAC(res.data.data.item))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(e => {
            handleServerAppError(e, dispatch)
        })
}

export const changeTodolistTitleTC = (todolistId: string, title: string) => async (dispatch: Dispatch) => {
    dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'))
    dispatch(setAppStatusAC('loading'))
    try {
        const res = await todolistAPI.changeTodolistTitle(todolistId, title)
        if (res.data.resultCode === 0) {
            dispatch(changeTodolistTitleAC(todolistId, title))
            dispatch(setAppStatusAC('succeeded'))
            dispatch(changeTodolistEntityStatusAC(todolistId, 'succeeded'))
        } else {
            handleServerAppError(res.data, dispatch)
            dispatch(changeTodolistEntityStatusAC(todolistId, 'failed'))
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
        dispatch(changeTodolistEntityStatusAC(todolistId, 'failed'))
    }
}


//Types
type ActionsType =
    RemoveTodolistACType
    | addTodolistACType
    | changeTodolistTitleACType
    | changeTodolistFilterACType
    | setTodolistsACType
    | ChangeTodolistEntityStatusAC

type RemoveTodolistACType = ReturnType<typeof removeTodolistAC>
type addTodolistACType = ReturnType<typeof addTodolistAC>
type changeTodolistTitleACType = ReturnType<typeof changeTodolistTitleAC>
type changeTodolistFilterACType = ReturnType<typeof changeTodolistFilterAC>
export type setTodolistsACType = ReturnType<typeof setTodolistsAC>
export type ChangeTodolistEntityStatusAC = ReturnType<typeof changeTodolistEntityStatusAC>

export type TodolistDomainType = TodolistsType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
