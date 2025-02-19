'use client'
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import moment from "moment-jalaali";
import { useState } from "react";
import { CalendarDays, ClockArrowDown, ClockArrowUp, TimerReset } from "lucide-react";
import { addNotification } from "@/app/store/notificationStore";
import AxiosInstance from "@/app/config/axiosInstance";
import { useAuthStore } from "@/app/store/authStore";
import { CloseModal } from "@/app/store/modalStore";
import { LoadingIcon } from "@/app/utils/loadingIcon";
export function NewAppointments({ callApi }) {
    const { token } = useAuthStore();
    const [date, setDate] = useState('');
    const [duration, setDuration] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [loading, setLoading] = useState(false);

    const handleDate = (value) => {
        const formattedDate = moment(new Date(value?.toDate?.().toString())).format("YYYY-MM-DD");
        setDate(formattedDate)
    }

    const handleStartTime = (value) => {
        if (value) {
            setStartTime(value.hour + ':' + value.minute + ':00');
        }
    }

    const handleEndTime = (value) => {
        if (value) {
            setEndTime(value.hour + ':' + value.minute + ':00');
        }
    }

    const compareTimes = (time1, time2) => {
        const toSeconds = (time) => {
            const [hours, minutes, seconds] = time.split(":").map(Number);
            return hours * 3600 + minutes * 60 + seconds;
        };
        return toSeconds(time2) >= toSeconds(time1);
    };

    const createNewAppointments = async () => {
        if (!date && !startTime && !endTime && !duration) {
            addNotification('لطفا تمام فیلد‌ها را کامل کنید', true);
            return
        }
        if (!compareTimes(startTime, endTime)) {
            addNotification('ساعت پایان نباید کمتر از ساعت شروع باشد ', true);
            return
        }
        if (duration > 60) {
            addNotification('مدت هر نوبت نباید از 60 دقیقه بیشتر باشد', true);
            return
        }
        setLoading(true);
        await AxiosInstance.postForm('/doctor/insert_setting_schedules',
            {
                appointment_date: date,
                start_time: startTime,
                end_time: endTime,
                duration: duration
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => {
                if (res.data.error) {
                    addNotification(res.data.message, true)
                } else {
                    addNotification(res.data.message);
                    CloseModal();
                    callApi();

                }
            })
        setLoading(false);
    }

    return (
        <>
            <div className="bg-blue-100 font-thin text-xs leading-6 rounded mb-3 flex w-full p-2 text-blue-800">براساس مدت هر نوبت بین ساعت شروع
                و پایان نوبت دهی، نوبت‌ها تقسیم می گردد
                <br />
                همچنین ثانیه در ساعت و شروع و پایان تاثیری ندارد.
            </div>
            <div className="mb-5" style={{ direction: "rtl" }}>
                <label className="text-xs flex gap-1 text-slate-500 mb-2">
                    <CalendarDays size={15} />
                    تاریخ نوبت دهی
                </label>
                <DatePicker
                    placeholder="تاریخ را انتخاب کنید"
                    onChange={handleDate}
                    containerClassName={'w-full block'}
                    inputClass={'w-full border block p-2 rounded text-center outline-none border-slate-300 text-sm'}
                    calendar={persian}
                    locale={persian_fa}
                    calendarPosition="bottom-right"
                />
            </div>
            <div className="mb-5">
                <label className="text-xs flex gap-1 text-slate-500 mb-2">
                    <ClockArrowDown size={15} />
                    ساعت شروع نوبت دهی
                </label>
                <DatePicker
                    disableDayPicker
                    onChange={handleStartTime}
                    placeholder="ساعت شروع را انتخاب کنید"
                    containerClassName={'w-full block'}
                    inputClass={'w-full border block p-2 rounded text-center outline-none border-slate-300  text-sm'}
                    format="HH:mm:ss"
                    plugins={[
                        <TimePicker />
                    ]}
                />
            </div>
            <div className="mb-5">
                <label className="text-xs flex gap-1 text-slate-500 mb-2">
                    <ClockArrowUp size={15} />
                    ساعت پایان نوبت دهی
                </label>
                <DatePicker
                    disableDayPicker
                    onChange={handleEndTime}
                    placeholder="ساعت پایان را انتخاب کنید"
                    containerClassName={'w-full block'}
                    inputClass={'w-full border block p-2 rounded text-center border-slate-300 outline-none text-sm'}
                    format="HH:mm:ss"
                    plugins={[
                        <TimePicker />
                    ]}
                />
            </div>
            <div className="mb-5">
                <label className="text-xs flex gap-1 text-slate-500 mb-2">
                    <TimerReset size={15} />
                    مدت هر نوبت
                </label>
                <input onKeyDown={(e) => {
                    if (e.key.match(/[^0-9]/) && e.key !== "Backspace") {
                        e.preventDefault();
                    }
                }} placeholder="مدت زمان هر نوبت به دقیقه" type="number" onChange={(e) => setDuration(e.target.value)} className="w-full border-slate-300 border block p-2 rounded text-center outline-none text-sm" value={duration} />
                <span className="block text-bold text-[9px] text-blue-400 text-left py-1">مقدار عددی و بصورت دقیقه</span>
            </div>
            <div>
                <button disabled={loading} onClick={() => createNewAppointments()} className="text-white flex items-center justify-center shadow text-xs text-center w-full rounded py-2 bg-violet-800 hover:bg-violet-900 transition-all">
                    {
                        loading ?
                            <LoadingIcon width={'w-4 text-white'} />
                            :
                            'ثبت نوبت جدید'
                    }
                </button>
            </div>
        </>
    )
}