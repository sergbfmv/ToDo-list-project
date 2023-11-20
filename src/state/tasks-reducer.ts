import {TasksStateType} from "../components/AppWithRedux/AppWithRedux";
import {addTodolistAC, removeTodolistAC, setTodolistsACType} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todolistAPI, UpdateTaskModelType} from "../api/todolist-api";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";


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
        default:
            return state
    }
}


//AC
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
export const createTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
    todolistAPI.createTask(todolistId, title)
        .then((res) => {
            const task = res.data.data.item
            dispatch(addTaskAC(todolistId, task))
        })
}

export const getTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    todolistAPI.getTasks(todolistId).then(res => {
        dispatch(getTasksAC(todolistId, res.data.items))
    })
}

export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
    todolistAPI.deleteTask(todolistId, taskId).then(res => {
        dispatch(removeTaskAC(todolistId, taskId))
    })
}

export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
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
    todolistAPI.updateTask(todolistId, taskId, apiModel).then(res => {
        dispatch(updateTaskAC(todolistId, taskId, domainModel))
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

type RemoveTaskAC = ReturnType<typeof removeTaskAC>
type AddTaskAC = ReturnType<typeof addTaskAC>
type UpdateTaskACType = ReturnType<typeof updateTaskAC>
type AddTodolistACType = ReturnType<typeof addTodolistAC>
type RemoveTodolistAC = ReturnType<typeof removeTodolistAC>
type getTasksAC = ReturnType<typeof getTasksAC>

type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}