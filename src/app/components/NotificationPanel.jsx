"use client"
import { motion, AnimatePresence } from "framer-motion";
import { X, CircleCheckBig, TriangleAlert } from "lucide-react";
import { useNotificationStore } from "../store/notificationStore";

export default function NotificationPanel() {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <div className="fixed bottom-5 left-5 space-y-2 z-[100]">
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className={`${notif.error ? 'bg-red-100' : 'bg-green-100'} bg-white shadow rounded-lg p-3 flex items-center justify-between w-72 lg:w-80`}
          >
            <div className={`${notif.error ? 'text-red-700' : 'text-green-700 '} font-bold p-2 flex gap-2 items-center justify-center text-xs text-right`}>
              {
                notif.error ? <TriangleAlert className="text-red-500 w-4 h-4 flex-none" /> : <CircleCheckBig className="text-green-500 flex-none w-4 h-4" />
              }
              <div>{notif.message}</div>
              
            </div>
            <button onClick={() => removeNotification(notif.id)}>
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}