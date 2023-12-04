import {
    addTodolistAC,
    removeTodolistAC,
    setTodolistsACType
} from "./todolists-reducer";
import {Dispatch} from "redux";
import {TasksStateType} from "../../components/AppWithRedux/AppWithRedux";
import {RequestStatusType, setAppStatusAC} from "../../components/AppWithRedux/app-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todolistAPI, UpdateTaskModelType} from "../../api/todolist-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {AppRootStateType} from "../../state/store";


const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].filter(t => t.id !== action.payload.taskId)
            }
        case 'ADD-TASK':
            return {
                ...state,
                [action.payload.todolistId]: [action.payload.task, ...state[action.payload.todolistId]]
            }
        case "UPDATE-TASK":
            return {
                ...state,
                [action.payload.todolistId]:
                    state[action.payload.todolistId]
                        .map(t => t.id === action.payload.taskId ? {...t, ...action.payload.model} : t)
            }
        case "ADD-TODOLIST":
            return {...state, [action.payload.todolist.id]: []}
        case "REMOVE-TODOLIST":
            const copeState = {...state}
            delete copeState[action.payload.todolistId]
            return copeState
        case "SET-TODOLISTS": {
            const copyState = {...state}
            action.payload.todos.forEach((tl) => {
                copyState[tl.id] = []
            })
            return copyState
        }
        case "GET-TASKS": {
            return {...state, [action.payload.todolistId]: action.payload.task}
        }
        case "CHANGE-TASK-ENTITY-STATUS": {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].map(t => t.id === action.payload.taskId ? {
                    ...t,
                    entityStatus: action.payload.entityStatus
                } : t)
            }
        }
        default:
            return state
    }
}


//AC
export const changeTaskEntityStatusAC = (todolistId: string, taskId: string, entityStatus: RequestStatusType) => {
    return {
        type: 'CHANGE-TASK-ENTITY-STATUS',
        payload: {
            todolistId,
            taskId,
            entityStatus
        }
    } as const
}

export const removeTaskAC = (todolistId: string, taskId: string,) => {
    return {
        type: 'REMOVE-TASK',
        payload: {
            todolistId,
            taskId
        }
    } as const
}

export const addTaskAC = (todolistId: string, task: TaskType,) => {
    return {
        type: 'ADD-TASK',
        payload: {
            todolistId,
            task
        }
    } as const
}

export const updateTaskAC = (todolistId: string, taskId: string, model: UpdateDomainTaskModelType) => {
    return {
        type: 'UPDATE-TASK',
        payload: {
            todolistId,
            taskId,
            model
        }
    } as const
}

export const changeTaskTitleAC = (todolistId: string, taskId: string, title: string) => {
    return {
        type: 'CHANGE-TASK-TITLE',
        payload: {
            todolistId,
            taskId,
            title
        }
    } as const
}

export const getTasksAC = (todolistId: string, task: TaskType[]) => {
    return {
        type: 'GET-TASKS',
        payload: {
            todolistId,
            task
        }
    } as const
}


//TC
export const addTaskTC = (todolistId: string, title: string) => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistAPI.createTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                const task = res.data.data.item
                dispatch(addTaskAC(todolistId, task))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(e => {
            handleServerAppError(e, dispatch)
        })
}

export const getTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistAPI.getTasks(todolistId)
        .then(res => {
            dispatch(getTasksAC(todolistId, res.data.items))
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch(e => {
            handleServerAppError(e, dispatch)
        })
}

export const removeTaskTC = (todolistId: string, taskId: string) => async (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'loading'))
    try {
        const res = await todolistAPI.deleteTask(todolistId, taskId)

        if (res.data.resultCode === 0) {
            dispatch(removeTaskAC(todolistId, taskId))
            dispatch(setAppStatusAC('succeeded'))
            dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'succeeded'))
        } else {
            handleServerAppError(res.data, dispatch)
            dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'failed'))
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
        dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'failed'))
    }
}

export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) => async (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const state = getState()
    const task = state.tasks[todolistId].find(t => t.id === taskId)

    if (!task) {
        return
    }

    const apiModel: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        title: task.title,
        priority: TaskPriorities.Low,
        startDate: task.startDate,
        status: task.status,
        ...domainModel
    }
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'loading'))

    todolistAPI.updateTask(todolistId, taskId, apiModel)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(updateTaskAC(todolistId, taskId, domainModel))
                dispatch(setAppStatusAC('succeeded'))
                dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
                dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'failed'))
            }
        })
        .catch(e => {
            handleServerAppError(e, dispatch)
            dispatch(changeTaskEntityStatusAC(todolistId, taskId, 'failed'))
        })
}


//Types
type ActionsType =
    RemoveTaskAC
    | AddTaskAC
    | UpdateTaskACType
    | AddTodolistACType
    | RemoveTodolistAC
    | setTodolistsACType
    | getTasksAC
    | ChangeTaskEntityStatusAC

type RemoveTaskAC = ReturnType<typeof removeTaskAC>
type AddTaskAC = ReturnType<typeof addTaskAC>
type UpdateTaskACType = ReturnType<typeof updateTaskAC>
type AddTodolistACType = ReturnType<typeof addTodolistAC>
type RemoveTodolistAC = ReturnType<typeof removeTodolistAC>
type getTasksAC = ReturnType<typeof getTasksAC>
type ChangeTaskEntityStatusAC = ReturnType<typeof changeTaskEntityStatusAC>

type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

export type ErrorType = {
    "statusCode": number
    "messages": string[]
    "error": string
}