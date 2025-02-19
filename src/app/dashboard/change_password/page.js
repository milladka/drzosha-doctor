"use client"
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export default function ChangePasswordPage() {
    const [showPassword, setShowPassword] = useState({ old: false, new: false, confirm: false });
    const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" });

    const toggleVisibility = (field) => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords((prev) => ({ ...prev, [name]: value }));
    };

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

                        <button className=" w-full lg:w-32 p-2 bg-violet-600 hover:bg-violet-700 text-white text-sm rounded">
                            تغییر رمز عبور
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
