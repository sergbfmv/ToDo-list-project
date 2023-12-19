import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { useAppSelector } from "app/store";
import { appActions } from "app/app-reducer";
import { useAppDispatch } from "common/hooks/useAppDispatch";

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
