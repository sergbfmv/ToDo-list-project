import {FilterValuesType, TasksStateType, TodolistType} from "../App";
import {v1} from "uuid";
import {addTodolistAC, removeTodolistAC} from "./todolists-reducer";

type ActionsType =
    RemoveTaskAC
    | AddTaskAC
    | ChangeTaskStatusAC
    | ChangeTitleStatusAC
    | AddTodolistACType
    | RemoveTodolistAC

type RemoveTaskAC = ReturnType<typeof removeTaskAC>
type AddTaskAC = ReturnType<typeof addTaskAC>
type ChangeTaskStatusAC = ReturnType<typeof changeTaskStatusAC>
type ChangeTitleStatusAC = ReturnType<typeof changeTitleStatusAC>
type AddTodolistACType = ReturnType<typeof addTodolistAC>
type RemoveTodolistAC = ReturnType<typeof removeTodolistAC>

export const tasksReducer = (state: TasksStateType, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId]
                    .filter(t => t.id !== action.payload.taskId)
            }
        case 'ADD-TASK':
            const newTask = {id: v1(), title: action.payload.title, isDone: false}
            return {
                ...state,
                [action.payload.todolistId]: [newTask, ...state[action.payload.todolistId]]
            }
        case "CHANGE-TASK-STATUS":
            return {
                ...state,
                [action.payload.todolistId]:
                    state[action.payload.todolistId]
                        .map(t => t.id === action.payload.taskId ? {...t, isDone: action.payload.isDone} : t)
        }
        case "CHANGE-TASK-TITLE":
            return {
                ...state,
                [action.payload.todolistId]:
                    state[action.payload.todolistId]
                        .map(t => t.id === action.payload.taskId ? {...t, title: action.payload.title} : t)
            }
        case "ADD-TODOLIST":
            return {...state, [action.payload.todolistId]: []}
        case "REMOVE-TODOLIST":
            const copeState = {...state}
            delete copeState[action.payload.todolistId]
            return copeState
        default:
            return state
    }
}

export const removeTaskAC = (taskId: string, todolistId: string) => {
    return {
        type: 'REMOVE-TASK',
        payload: {
            taskId,
            todolistId
        }
    } as const
}

export const addTaskAC = (title: string, todolistId: string) => {
    return {
        type: 'ADD-TASK',
        payload: {
            title,
            todolistId
        }
    } as const
}

export const changeTaskStatusAC = (taskId: string, isDone: boolean, todolistId: string) => {
    return {
        type: 'CHANGE-TASK-STATUS',
        payload: {
            taskId,
            isDone,
            todolistId
        }
    } as const
}

export const changeTitleStatusAC = (taskId: string, title: string, todolistId: string) => {
    return {
        type: 'CHANGE-TASK-TITLE',
        payload: {
            taskId,
            title,
            todolistId
        }
    } as const
}
