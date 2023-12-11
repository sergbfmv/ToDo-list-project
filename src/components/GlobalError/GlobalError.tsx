import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "state/store";
import { appActions } from "app/app-reducer";

export const GlobalError = () => {
  const error = useAppSelector((state) => state.app.error);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    dispatch(appActions.setAppErrorAC({ error: null }));
  }, [error]);

  return (
    <div>
      <ToastContainer position={"bottom-center"} autoClose={3000} theme={"colored"} />
    </div>
  );
};
