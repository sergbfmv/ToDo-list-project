import { useDispatch } from "react-redux";
import { AppDispatchType } from "app/store";

// export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppDispatch = () => useDispatch<AppDispatchType>();
