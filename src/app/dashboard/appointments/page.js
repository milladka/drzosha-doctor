"use client"
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import AxiosInstance from "@/app/config/axiosInstance";
import { useAuthStore } from "@/app/store/authStore";
import moment from 'moment-jalaali';
moment.locale('fa');
moment.loadPersian({ dialect: 'persian' });

export default function AppointmentsPage() {
    const { token } = useAuthStore()
    const fetchedRef = useRef(false);
    const [data, setData] = useState({
        loading: true,
        appointments: []
    });

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;
        AxiosInstance.get('/doctor/get_reservation_doctor', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => {
                setData({
                    appointments: res.data.data,
                    loading: false,
                })
            });
    }, []);

    let formattedTime = (time) => time ? time.split(":").slice(0, 2).join(":") : '';
    let shamsiDate = (miladiDate) => miladiDate ? moment(miladiDate, "YYYY-MM-DD").format("jYYYY/jMM/jDD") : '';


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
                            <th className="py-3 px-6 text-center">کد نوبت</th>
                            <th className="py-3 px-6 text-center">نام و نام خانوادگی بیمار</th>
                            <th className="py-3 px-6 text-center">کدملی</th>
                            <th className="py-3 px-6 text-center">موبایل</th>
                            <th className="py-3 px-6 text-center">تاریخ و ساعت</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm">
                        {
                            data.appointments && data.appointments.length > 0 ?
                                (
                                    data.appointments.map((item, index) => (
                                        <tr key={index} className="border-b hover:bg-gray-100">
                                            <td className="py-3 px-6 text-center">{item.reserveId}</td>
                                            <td className="py-3 px-6 text-center">{item.firstname} {item.lastname}</td>
                                            <td className="py-3 px-6 text-center">{item.national_code}</td>
                                            <td className="py-3 px-6 text-center">{item.phone}</td>
                                            <td className="py-3 px-6 text-center">{shamsiDate(item.appointment_date)} - {formattedTime(item.reservation_time)}</td>
                                        </tr>
                                    ))
                                )
                                :
                                (
                                    <tr>
                                        <td colSpan="8" className="py-4 text-center text-gray-500">
                                            هیچ نوبتی یافت نشد
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