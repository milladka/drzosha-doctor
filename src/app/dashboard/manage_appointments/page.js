"use client"
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import AxiosInstance from "@/app/config/axiosInstance";
import { useAuthStore } from "@/app/store/authStore";
import Modal from "@/app/components/modal";
import { OpenModal } from "@/app/store/modalStore";
import moment from 'moment-jalaali';
import { NewAppointments } from "@/app/components/manage_appointments/new_appointments";
import { TicketPlus } from "lucide-react";
moment.locale('fa');
moment.loadPersian({ dialect: 'persian' });

export default function ManageAppointmentsPage() {
    const { token } = useAuthStore()
    const fetchedRef = useRef(false);
    const [data, setData] = useState({
        loading: true,
        appointments: []
    });

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;
        AxiosInstance.get('/doctor/get_appointment_doctor', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => {
                setData({
                    appointments: res.data.data,
                    loading: false,
                })
            });

    }, []);

    const callApi = () => {
        setData({
            loading: true
        })
        AxiosInstance.get('/doctor/get_appointment_doctor', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => {
                setData({
                    appointments: res.data.data,
                    loading: false,
                })
            });
    }

    let formattedTime = (time) => time ? time.split(":").slice(0, 2).join(":") : '';
    let shamsiDate = (miladiDate) => miladiDate ? moment(miladiDate, "YYYY-MM-DD").format("jYYYY/jMM/jDD") : '';


    return (
        <>
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
                    <>
                        <div>
                            <button className="rounded text-sm font-bold flex items-center gap-2 hover:bg-violet-500 hover:text-white transition-all text-center p-2 text-violet-900 bg-violet-300 mb-2" onClick={() => OpenModal()}>
                                <TicketPlus width={20} />
                                ایجاد نوبت جدید

                            </button>

                        </div>
                        <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden border border-slate-500">
                            <thead className="bg-gray-200 text-gray-600 text-sm uppercase">
                                <tr>
                                    <th className="py-3 px-6 text-center">کد نوبت</th>
                                    <th className="py-3 px-6 text-center">تاریخ</th>
                                    <th className="py-3 px-6 text-center">ساعت شروع</th>
                                    <th className="py-3 px-6 text-center">ساعت پایان</th>
                                    <th className="py-3 px-6 text-center">مدت هر نوبت</th>
                                    <th className="py-3 px-6 text-center">عملیات</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 text-sm">
                                {(() => {
                                    const filteredAppointments = data.appointments?.filter(item => Number(item.is_past) === 0) || [];

                                    return filteredAppointments.length > 0 ? (
                                        filteredAppointments.map((item, index) => (
                                            <tr key={index} className="border-b hover:bg-gray-100">
                                                <td className="py-3 px-6 text-center">{item.id}</td>
                                                <td className="py-3 px-6 text-center">{shamsiDate(item.appointment_date)}</td>
                                                <td className="py-3 px-6 text-center">{formattedTime(item.start_time)}</td>
                                                <td className="py-3 px-6 text-center">{formattedTime(item.end_time)}</td>
                                                <td className="py-3 px-6 text-center">{item.duration}</td>
                                                <td className="py-3 px-6 text-center">
                                                    {item.is_past === 0 && (
                                                        <button className="text-xs border text-red-700 border-red-700 hover:bg-red-700 transition-all duration-200 rounded px-2 py-1 hover:text-white">
                                                            حذف
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="py-4 text-center text-gray-500">
                                                هیچ نوبتی یافت نشد
                                            </td>
                                        </tr>
                                    );
                                })()}
                            </tbody>
                        </table>
                    </>
                )}
            </div>

            <Modal title={'ثبت نوبت جدید'}>
                <NewAppointments callApi={callApi} />
            </Modal>
        </>
    );
}