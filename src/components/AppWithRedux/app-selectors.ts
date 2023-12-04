import {AppRootStateType} from "../../state/store";

export const selectAppStatus = (state: AppRootStateType) => state.app.status
export const selectAppError = (state: AppRootStateType) => state.app.error
export const selectAppIsLoggedIn = (state: AppRootStateType) => state.auth.isLoggedIn
export const selectIsInitialized = (state: AppRootStateType) => state.app.isInitialized
