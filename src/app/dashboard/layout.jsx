"use client"
import { useEffect, useState } from "react";
import SideNav from "../components/sideNav";
import { useAuthStore } from "../store/authStore";
import { useRouter } from 'next/navigation'
import { LoadingIcon } from "../utils/loadingIcon";

export default function Layout({ children }) {
    const { token } = useAuthStore();
    const router = useRouter();
    const [firstLoad, setFirstLoad] = useState(true);

    useEffect(() => {
        if (!token) {
            router.push('/');
        } else {
            setFirstLoad(false)
        }
    }, [])

    if (firstLoad) {
        return <div className="flex items-center justify-center h-screen w-screen bg-slate-50">
            <LoadingIcon width={'w-10'} />
        </div>
    }

    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-slate-50">
            <div className="w-full flex-none md:w-52">
                <SideNav />
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-8 mt-14 lg:mt-0">{children}</div>
        </div>
    );
}