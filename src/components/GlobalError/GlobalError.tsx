import 'react-toastify/dist/ReactToastify.css';
import {toast, ToastContainer} from "react-toastify";
import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../state/store";
import {setAppErrorAC} from "../AppWithRedux/app-reducer";


export const GlobalError = () => {

    const error = useAppSelector(state => state.app.error)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
        dispatch(setAppErrorAC(null))
    }, [error]);

    return (
        <div>
            <ToastContainer position={'bottom-center'} autoClose={3000} theme={'colored'}/>
        </div>
    );
}