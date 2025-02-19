import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useModalStore } from "../store/modalStore";

export default function Sidebar({ children, title }) {
    const { isOpen, CloseModal } = useModalStore();

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="fixed left-0 top-0 h-full min-w-full lg:min-w-96 bg-white shadow-xl z-50"
                        onAnimationComplete={(definition) => {
                            if (definition === "exit") {
                                CloseModal();
                            }
                        }}
                    >
                        <div className="p-3 flex gap-2 items-center justify-between border-b">
                            <div className="font-bold">{title}</div>
                            <button
                                className="text-gray-500 hover:text-gray-800"
                                onClick={() => CloseModal()}
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-3 overflow-auto h-full">{children}</div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}