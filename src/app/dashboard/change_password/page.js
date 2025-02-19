"use client"
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import AxiosInstance from "@/app/config/axiosInstance";
import { useAuthStore } from "@/app/store/authStore";
import { addNotification } from "@/app/store/notificationStore";
import { LoadingIcon } from "@/app/utils/loadingIcon";

export default function ChangePasswordPage() {
    const { token } = useAuthStore();
    const [showPassword, setShowPassword] = useState({ old: false, new: false, confirm: false });
    const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" });
    const [loading, setLoading] = useState(false);

    const toggleVisibility = (field) => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords((prev) => ({ ...prev, [name]: convertPersianToEnglishNumbers(value) }));
    };

    const convertPersianToEnglishNumbers = (input) => {
        const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return input.replace(/[۰-۹]/g, (char) => persianNumbers.indexOf(char));
    }

    const submit = () => {
        if (passwords.confirm != passwords.new) {
            addNotification('رمز عبور جدید با تکرار آن برابر نیست', true);
            return;
        }
        setLoading(true);
        AxiosInstance.postForm('/doctor/change_password', passwords, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                if (!res.data.error) {
                    addNotification(res.data.message, false);
                    setPasswords((prev) => ({ ...prev, old: "", new: "", confirm: "" }));
                    setLoading(false);
                } else {
                    addNotification(res.data.message, true);
                    setLoading(false);
                }
            })
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className=""
        >
            <div className="">
                <div className="text-xl font-bold mb-5">تغییر رمز عبور</div>
                <div className="grid grid-cols-3 gap-3">
                    {['old', 'new', 'confirm'].map((field, index) => (
                        <div key={index} className="relative mb-4">
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                {field === 'old' ? 'رمز عبور قبلی' : field === 'new' ? 'رمز عبور جدید' : 'تکرار رمز جدید'}
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword[field] ? "text" : "password"}
                                    name={field}
                                    value={passwords[field]}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 text-left border rounded outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleVisibility(field)}
                                    className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                                >
                                    {showPassword[field] ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="col-span-3 flex items-end justify-end">
                        <button disabled={loading} onClick={() => submit()} className="flex items-center justify-center w-full lg:w-32 p-2 bg-violet-600 hover:bg-violet-700 text-white text-sm rounded">
                            {
                                loading ?
                                    <LoadingIcon width={'w-5'} />
                                    :
                                    <span>تغییر رمز عبور</span>
                            }
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
