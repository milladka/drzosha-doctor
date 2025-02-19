"use client"
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Settings, Menu, X, Ribbon, Stethoscope, LogOut, Tickets } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import Link from "next/link";
import { useAuthStore } from "../store/authStore";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const pathname = usePathname();
    const { token, user, deleteToken } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsOpen(true);
            } else {
                setIsOpen(false);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => setLoading(false), 500);

        return () => clearTimeout(timeout);
    }, [pathname]);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleClose = () => {
        if (window.innerWidth >= 768) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }

    const Logout = () => {
        router.push('/');
        deleteToken();
    }

    const menuItems = [
        { name: "داشبورد", icon: <Home size={18} />, link: "/dashboard" },
        { name: "نوبت های ثبت شده", icon: <Tickets size={18} />, link: "/dashboard/appointments" },
        { name: "ثبت نوبت", icon: <Ribbon size={18} />, link: "/dashboard/manage_appointments" },
        { name: "ویرایش پروفایل", icon: <Stethoscope size={18} />, link: "/dashboard/profile" },
        { name: "تنظیمات", icon: <Settings size={18} />, link: "#" },
    ];

    return (
        <div className="flex">
            {loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed top-0 left-0 w-full h-0.5 bg-violet-300 z-50"
                >
                    <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-violet-500"
                    ></motion.div>
                </motion.div>
            )}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isOpen ? 0.5 : 0 }}
                transition={{ duration: 0.3, delay: isOpen ? 0.2 : 0 }}
                className={`z-20 fixed inset-0 bg-slate-500 md:hidden ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
                onClick={toggleSidebar}
            ></motion.div>
            {/* Sidebar */}
            <motion.aside
                initial={{ x: 208 }}
                animate={{ x: isOpen ? 0 : 208 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-900 text-white h-screen w-52 fixed right-0 md:relative md:translate-x-0 z-30"
            >
                <div className="p-4 flex justify-between items-center">
                    <span className="text-md lg:text-lg font-bold">پنل پزشکان دکتر زوشا</span>
                    <X className="cursor-pointer md:hidden" onClick={toggleSidebar} />
                </div>
                <div className="bg-slate-800 py-2 border-t border-slate-700">
                    <div className="text-center text-xs">
                        {token && 'دکتر ' + user?.first_name + ' ' + user?.last_name}
                        <span className="block py-1 text-xs">{token && 'شناسه ' + user?.id}</span>
                    </div>
                </div>
                <ul className="p-4">
                    {menuItems.map((item, index) => (
                        <Link
                            onClick={() => handleClose()}
                            key={index}
                            href={item.link}
                            className={`transition-all mb-1 flex items-center gap-2 p-2 rounded-md cursor-pointer 
                                ${pathname === item.link ? "bg-slate-800" : "hover:bg-gray-700"}`}
                        >
                            {item.icon}
                            <span className="text-xs">{item.name}</span>
                        </Link>
                    ))}
                    <Link
                        href={'/'}
                        className={`transition-all mb-1 flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-gray-700`}
                        onClick={() => Logout()}>
                        <LogOut size={18} />
                        <span className="text-xs">خروج</span>
                    </Link>
                </ul>
            </motion.aside>

            {/* Menu Button for Mobile */}
            <div className="min-h-12 p-2 bg-white border shadow w-full fixed md:hidden z-10">
                <div className="flex justify-start items-center">
                    <button
                        className="p-2 text-gray-800 rounded-md"
                        onClick={toggleSidebar}
                    >
                        <Menu size={24} />
                    </button>
                    <span className="text-lg font-bold">پنل پزشکان دکتر زوشا</span>
                </div>

            </div>
        </div>
    );
};

export default Sidebar;