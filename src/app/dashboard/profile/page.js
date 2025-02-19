"use client"
import AxiosInstance from "@/app/config/axiosInstance";
import { useAuthStore } from "@/app/store/authStore";
import { addNotification } from "@/app/store/notificationStore";
import { LoadingIcon } from "@/app/utils/loadingIcon";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProfilePage() {
    const { token } = useAuthStore();
    const [data, setData] = useState({
        firstLoading: true,
        data: null,
        address: null,
        phones: null,
        content: null,
        loadingSubmit: false
    });

    useEffect(() => {
        AxiosInstance.get('/doctor', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                if (!res.data.error) {
                    setData((prev) => ({
                        ...prev,
                        address: res.data.data.address,
                        phones: res.data.data.phones,
                        content: res.data.data.content.replace(/&zwnj;/g, ' '),
                        firstLoading: false,
                    }))
                }
            })
    }, [])

    const updateProfile = () => {
        //console.log(data)
        if (!data.address && !data.content && !data.phones) {
            addNotification('تمام فیلدها الزامی است', true);
            return;
        }
        setData((prev) => ({ ...prev, loadingSubmit: true }));
        AxiosInstance.postForm('/doctor/update_profile', {
            address: data.address,
            phones: data.phones,
            content: data.content
        },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        )
            .then(res => {
                if (!res.data.error) {
                    setData((prev) => ({ ...prev, loadingSubmit: false }));
                    addNotification(res.data.message);
                } else {
                    setData((prev) => ({ ...prev, loadingSubmit: false }));
                    addNotification(res.data.message, true);
                }
            })
    }

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
        <div className="overflow-x-auto p-1 lg:p-4">
            <div className="bg-blue-100 flex gap-2 items-center font-normal text-xs leading-6 rounded mb-3 w-full p-2 text-blue-500">
                <Info width={15} />
                شما می‌توانید اطلاعات پایه پروفایل خود را از طریق پشتیبانی دکتر زوشا تغییر دهید
            </div>
            <div className="grid grid-col-1 lg:grid-cols-2 gap-3">
                <div>
                    <label className="text-xs text-slate-500 mb-2 px-1 block">آدرس</label>
                    <input className="block w-full p-2 rounded border text-xs outline-none" defaultValue={data.address} onChange={(e) => setData((prev) => ({ ...prev, address: e.target.value }))} />
                </div>
                <div>
                    <label className="text-xs text-slate-500 mb-2 px-1 block">تلفن</label>
                    <input className="block w-full p-2 rounded border text-xs outline-none" defaultValue={data.phones} onChange={(e) => setData((prev) => ({ ...prev, phones: e.target.value }))} />
                </div>
                <div className="col-span-2">
                    <label className="text-xs text-slate-500 mb-2 px-1 block">محتوای درباره دکتر</label>
                    <textarea style={{whiteSpace: 'pre-line'}} rows={20} className="block w-full p-2 rounded border text-sm outline-none leading-7" defaultValue={data.content} onChange={(e) => setData((prev) => ({ ...prev, content: e.target.value }))} ></textarea>
                </div>
                <div></div>
                <div>
                    <button disabled={data.loadingSubmit} onClick={() => updateProfile()} className="text-white flex items-center justify-center shadow text-xs text-center w-full rounded py-3 bg-violet-800 hover:bg-violet-900 transition-all">
                        {
                            data.loadingSubmit ?
                                <LoadingIcon width={'w-4 text-white'} />
                                :
                                'ویرایش پروفایل'
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}
