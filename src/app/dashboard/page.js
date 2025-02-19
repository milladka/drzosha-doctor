"use client"
import { CalendarDays, Users, DollarSign, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import AxiosInstance from "../config/axiosInstance";
import { useAuthStore } from "../store/authStore";

function Card({ children }) {
  return <div className="bg-white p-4 rounded-lg shadow-md">{children}</div>;
}

export default function DashboardPage() {
  const { token } = useAuthStore();
  const [data, setData] = useState({
    loading: true,
    allReservations: null,
    reservations: null,
    appointments: null
  })

  useEffect(() => {
    setData((prev) => ({ ...prev, loading: true }));
    AxiosInstance.get('/doctor/report', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.data.error) {
          setData((prev) => ({
            ...prev,
            appointments: res.data?.appointments,
            reservations: res.data?.reservations,
            allReservations: res.data?.allReservations,
            loading: true
          }));
        }
      })
  }, []);

  if (data.firstLoading) {
    return (
      <div className="overflow-x-auto p-4">
        <div className="flex justify-center items-center h-64">
          <motion.div
            className="w-10 h-10 border-4 border-slate-500 border-t-transparent rounded-full animate-spin"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 lg:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Stats Cards */}
      <motion.div whileHover={{ scale: 1.05 }}>
        <Card>
          <div className="flex items-center gap-4">
            <CalendarDays className="text-blue-500" size={32} />
            <div>
              <p className="text-gray-600">کل نوبت‌ها</p>
              <h2 className="text-xl font-bold">{data.appointments}</h2>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div whileHover={{ scale: 1.05 }}>
        <Card>
          <div className="flex items-center gap-4">
            <Users className="text-green-500" size={32} />
            <div>
              <p className="text-gray-600">بیماران امروز</p>
              <h2 className="text-xl font-bold">{data.reservations}</h2>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div whileHover={{ scale: 1.05 }}>
        <Card>
          <div className="flex items-center gap-4">
            <DollarSign className="text-yellow-500" size={32} />
            <div>
              <p className="text-gray-600">درآمد امروز</p>
              <h2 className="text-xl font-bold">1,200,000 تومان</h2>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div whileHover={{ scale: 1.05 }}>
        <Card>
          <div className="flex items-center gap-4">
            <Clock className="text-violet-500" size={32} />
            <div>
              <p className="text-gray-600">نوبت‌های رزرو شده</p>
              <h2 className="text-xl font-bold">{data.allReservations}</h2>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}