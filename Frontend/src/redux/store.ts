import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import conversationSlice from "./features/conversationSlice";
import notificationsSlice from "./features/notificationsSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    conversation: conversationSlice,
    notifications: notificationsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
