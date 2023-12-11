import { isAxiosError } from "axios";
import { Dispatch } from "redux";
import { ResponseType } from "api/todolist-api";
import { appActions } from "app/app-reducer";

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
  if (data.messages.length) {
    dispatch(appActions.setAppErrorAC({ error: data.messages[0] }));
  } else {
    dispatch(appActions.setAppErrorAC({ error: "Some error" }));
  }
  dispatch(appActions.setAppStatusAC({ status: "failed" }));
};

export const handleServerNetworkError = (e: unknown, dispatch: Dispatch) => {
  if (isAxiosError<ErrorType>(e)) {
    const error = e.response ? e.response.data.messages[0] : e.message;
    dispatch(appActions.setAppErrorAC({ error }));
  } else {
    dispatch(appActions.setAppErrorAC({ error: (e as Error).message }));
  }
};

export type ErrorType = {
  statusCode: number;
  messages: string[];
  error: string;
};
