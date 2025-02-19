import axios from "axios";
import { addNotification } from "../store/notificationStore";
//import { setCookie } from "cookies-next";
//import { toast } from "react-toastify";
//import ERRORS from "@/app/constant/errors.json";
// process.env.BASE_URL
const AxiosInstance = axios.create({
    baseURL: 'https://keyhantex.ir/drzosha'
});
AxiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status == 401) {
            //setCookie("authToken", "", { maxAge: -1 });
        } else {
            if (error.response && error.response.status == 400) {
                //toast.error('درخواست شما قابل قبول نیست')
                addNotification('درخواست شما پذیرفته نیست', true);
            }
            if (error?.response?.data?.message) {
                // var error = ERRORS.find(item => item.key == error.response.data.message);
                // if (error) {
                //     //toast.error(error?.message)
                // }
            }
        }

        return Promise.reject(error);
    });

export default AxiosInstance;