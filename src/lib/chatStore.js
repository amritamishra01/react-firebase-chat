import { create } from 'zustand';
import { doc, getDoc } from "firebase/firestore";
import { db } from './firebase';
import { useUserStore } from './userStore';

export const usechatStore = create((set) => ({
  chatId: null,
  user: null,
  isReceiverBlocked: false,
  isCurrentUserBlocked: false,

  changeChat: (chatId, user) => {
    const currentUser = useUserStore.getState().currentUser;

    // Check if current user is blocked by receiver
    if (user.blocked.includes(currentUser.id)) {
      set({
        chatId,
        user: null,
        isReceiverBlocked: true,
        isCurrentUserBlocked: false,
      });
      return;
    }

    // Check if receiver is blocked by current user
    if (currentUser.blocked.includes(user.id)) {
      set({
        chatId,
        user: null,
        isReceiverBlocked: false,
        isCurrentUserBlocked: true,
      });
      return;
    }

    // Normal chat change
    set({
      chatId,
      user,
      isReceiverBlocked: false,
      isCurrentUserBlocked: false,
    });
  },

  // ✅ This must be outside of changeChat
  changeBlock: () => {
    set((state) => ({
      ...state,
      isCurrentUserBlocked: !state.isReceiverBlocked,
    }));
  }
}));
