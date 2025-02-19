import { create } from "zustand";

export const useNotificationStore = create((set) => ({
  notifications: [],
  addNotification: (message, error = false) => {
    const id = Date.now();
    set((state) => ({
      notifications: [...state.notifications, { id, message, error }],
    }));
    setTimeout(
      () =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
      3000
    );
  },
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));

export const addNotification = (message, error = false) => {
  useNotificationStore.getState().addNotification(message, error);
};
