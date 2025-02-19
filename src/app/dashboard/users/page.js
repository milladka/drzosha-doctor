"use client"
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import AxiosInstance from "@/app/config/axiosInstance";

export default function usersPage() {
    const fetchedRef = useRef(false);
    const [data, setData] = useState({
        loading: true,
        users: []
    });

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;
        AxiosInstance.get('/admin/get_all_users')
            .then((res) => {
                setData({
                    users: res.data,
                    loading: false,
                });
            });
    }, []);

    return (
        <div className="overflow-x-auto p-4">
            {data.loading ? (
                <div className="flex justify-center items-center h-64">
                    <motion.div
                        className="w-10 h-10 border-4 border-slate-500 border-t-transparent rounded-full animate-spin"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    />
                </div>
            ) : (
                <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden border border-slate-500">
                    <thead className="bg-gray-200 text-gray-600 text-sm uppercase">
                        <tr>
                            <th className="py-3 px-6 text-center">شناسه</th>
                            <th className="py-3 px-6 text-center">نام و نام خانوادگی</th>
                            <th className="py-3 px-6 text-center">کدملی</th>
                            <th className="py-3 px-6 text-center">جنسیت</th>
                            <th className="py-3 px-6 text-center">سال تولد</th>
                            <th className="py-3 px-6 text-center">موبایل</th>
                            <th className="py-3 px-6 text-center">شهر</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm">
                        {
                            data.users.length > 0 ?
                                (
                                    data.users.map((item, index) => (
                                        <tr key={index} className="border-b hover:bg-gray-100">
                                            <td className="py-3 px-6 text-center">{item.id}</td>
                                            <td className="py-3 px-6 text-center">{item.firstname} {item.lastname}</td>
                                            <td className="py-3 px-6 text-center">{item.national_code}</td>
                                            <td className="py-3 px-6 text-center">{item.gender === 'male' ? 'مرد' : 'زن'}</td>
                                            <td className="py-3 px-6 text-center">{item.birth_year}</td>
                                            <td className="py-3 px-6 text-center">{item.phone}</td>
                                            <td className="py-3 px-6 text-center">{item.city} - {item.province}</td>
                                        </tr>
                                    ))
                                )
                                :
                                (
                                    <tr>
                                        <td colSpan="8" className="py-4 text-center text-gray-500">
                                            هیچ پزشکی یافت نشد.
                                        </td>
                                    </tr>
                                )
                        }
                    </tbody>
                </table>
            )}
        </div>
    );
}