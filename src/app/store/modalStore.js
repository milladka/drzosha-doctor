import { create } from "zustand";

export const useModalStore = create((set) => ({
    isOpen: false,
    OpenModal: () =>
        set(() => ({
            isOpen: true
        })),
    CloseModal: () =>
        set(() => ({
            isOpen: false
        }))
}));

export const OpenModal = () => {
    useModalStore.getState().OpenModal();
};

export const CloseModal = () => {
    useModalStore.getState().CloseModal();
};