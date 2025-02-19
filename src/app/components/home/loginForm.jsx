'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeClosed, Lock, User } from 'lucide-react';
import { useRouter } from 'next/navigation'
import AxiosInstance from '@/app/config/axiosInstance';
import { addNotification } from '@/app/store/notificationStore';
import { useAuthStore } from '@/app/store/authStore';
import { LoadingIcon } from '@/app/utils/loadingIcon';

export default function LoginForm() {
  const { setToken, setUser, token } = useAuthStore()
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  // useEffect(() => {
  //   if ("serviceWorker" in navigator) {
  //     if ("Notification" in window && navigator.serviceWorker) {
  //       Notification.requestPermission().then((permission) => {
  //         if (permission === "granted") {
  //           console.log("🔔 اجازه نوتیفیکیشن داده شد!");
  //         } else {
  //           console.log("❌ اجازه نوتیفیکیشن رد شد!");
  //         }
  //       });
  //     }

  //     navigator.serviceWorker.register("/service-worker.js")
  //       .then((reg) => console.log("Service Worker Registered!", reg))
  //       .catch((err) => console.error("Service Worker Registration Failed!", err));
  //   }
  // }, []);

  useEffect(() => {
    if (token) {
      router.push('/dashboard');
    }
  }, [])

  const convertPersianToEnglish = (str) => {
    return str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
  };

  const handleSubmit = async() => {
    if (!username || !password) {
      setError('ایمیل و رمز عبور را وارد کنید');
      return;
    }
    setError('');
    setLoading(true);
    await AxiosInstance.postForm('/auth/login_doctor', {
      username: convertPersianToEnglish(username),
      password: convertPersianToEnglish(password)
    })
      .then(res => {
        if (res.data.error) {
          setError(res.data.messsage);
          addNotification(res.data.messsage, true)
        } else {
          setToken(res.data?.token)
          setUser(res.data?.user)
          addNotification('ورود موفقیت آمیز')
          router.push('/dashboard')
        }
        setLoading(false);
      })
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-96 bg-white shadow-lg rounded-2xl p-6">
          <div className="text-center mb-6">
            <h2 className="mb-2 text-xl text-violet-700 font-bold">ورود به پنل پزشکان</h2>
          </div>
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-500" size={20} />
              <input
                type="text"
                name='mobile'
                dir='ltr'
                autoComplete='no'
                placeholder="نام کاربری"
                className="w-full pl-10 text-center pr-4 py-2 border border-gray-300 outline-none rounded-lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
              <input
                type={show ? "text" : "password"}
                name='password'
                dir='ltr'
                autoComplete='no'
                placeholder="رمز عبور"
                className="w-full pl-10 pr-4 py-2 text-center  border border-gray-300 rounded-lg outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {!show ? <Eye onClick={() => setShow(!show)} className="absolute right-3 top-3 text-gray-400 cursor-pointer" size={15} /> : <EyeClosed onClick={() => setShow(!show)} className="cursor-pointer absolute right-3 top-3 text-gray-400" size={15} />}
            </div>
            <button
              disabled={loading}
              className="w-full bg-violet-500 text-center flex items-center justify-center text-white py-2 rounded-lg hover:bg-violet-600 transition"
              onClick={() => handleSubmit()}
            >
              {
                loading ? (<LoadingIcon />) : ('ورود')
              }
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}