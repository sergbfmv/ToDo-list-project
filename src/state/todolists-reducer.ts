import {FilterValuesType} from "../components/AppWithRedux/AppWithRedux";
import {Dispatch} from "redux";
import {todolistAPI, TodolistsType} from "../api/todolist-api";


const initialState: TodolistDomainType[] = []

export const todolistsReducer = (state: TodolistDomainType[] = initialState, action: ActionsType): TodolistDomainType[] => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id !== action.payload.todolistId)
        }
        case 'ADD-TODOLIST': {
            const newTodo: TodolistDomainType = {...action.payload.todolist, filter: 'all'}
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
            return action.payload.todos.map(tl => ({...tl, filter: 'all'}))
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


//TC
export const getTodolistsTC = () => (dispatch: Dispatch) => {
    todolistAPI.getTodolists().then((res) => dispatch(setTodolistsAC(res.data)))
}

export const deleteTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
    todolistAPI.deleteTodolist(todolistId).then(res => {
        dispatch(removeTodolistAC(todolistId))
    })
}

export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
    todolistAPI.createTodolist(title).then(res => {
        dispatch(addTodolistAC(res.data.data.item))
    })
}

export const changeTodolistTitleTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    todolistAPI.changeTodolistTitle(todolistId, title).then(res => {
        dispatch(changeTodolistTitleAC(todolistId, title))
    })
}


//Types
type ActionsType =
    RemoveTodolistACType
    | addTodolistACType
    | changeTodolistTitleACType
    | changeTodolistFilterACType
    | setTodolistsACType

type RemoveTodolistACType = ReturnType<typeof removeTodolistAC>
type addTodolistACType = ReturnType<typeof addTodolistAC>
type changeTodolistTitleACType = ReturnType<typeof changeTodolistTitleAC>
type changeTodolistFilterACType = ReturnType<typeof changeTodolistFilterAC>
export type setTodolistsACType = ReturnType<typeof setTodolistsAC>

export type TodolistDomainType = TodolistsType & {
    filter: FilterValuesType
}
