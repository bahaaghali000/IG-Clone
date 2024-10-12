import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export const getNotifications: any = createAsyncThunk(
  "/notifications/get",
  async () => {
    try {
      const { data } = await axios.get("/notifications");

      return data.data;
    } catch (e: any) {
      console.log(e.response.data.message);
    }
  }
);

interface INotificationsSlice {
  loading: boolean;
  error: undefined | string;
  notifications: any;
}

const initialState: INotificationsSlice = {
  loading: false,
  error: undefined,
  notifications: [],
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<any>) => {
      state.notifications = action.payload;
    },
    addNotification: (state, action: PayloadAction<any>) => {
      // state.notifications = [action.payload, ...state.notifications];
      state.notifications.unshift(action.payload);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getNotifications.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.error = undefined;
        state.notifications = action.payload || [];
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setNotifications, addNotification } = notificationsSlice.actions;

export default notificationsSlice.reducer;
