import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { IUser } from "../../models/User";

export const getMyDetails = createAsyncThunk("/auth/get", async () => {
  try {
    const { data } = await axios.get("/auth");

    return data.user;
  } catch (e: any) {
    console.log(e.response.data.message);
  }
});

export interface AuthState {
  loading: boolean;
  error: string | undefined;
  lng: string;
  userInfo: IUser;
  isAuthenticited: boolean;
  darkMode: boolean;
}

const initialState: AuthState = {
  loading: false,
  error: undefined,
  lng: localStorage.getItem("i18nextLng") || "en",
  userInfo: undefined,
  isAuthenticited: false,
  darkMode: false,
};

export const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
      state.isAuthenticited = action.payload ? true : false;
    },
    updateProfilePicture: (state, action) => {
      state.userInfo = { ...state.userInfo, avatar: action.payload };
    },
    setLng: (state) => {
      state.lng = localStorage.getItem("i18nextLng") || "en";

      document.documentElement.lang = state.lng;

      if (state.lng === "ar") {
        document.body.classList.add("rtl");
        document.body.classList.remove("ltr");
      } else {
        document.body.classList.remove("rtl");
        document.body.classList.add("ltr");
      }
    },
    setIsDarkMode: (state) => {
      const isDarkMode = localStorage.getItem("darkMode") === "true";

      state.darkMode = isDarkMode;

      document.documentElement.classList.toggle("dark", state.darkMode);
    },
    themeSwitcher: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem("darkMode", state.darkMode.toString());
      document.documentElement.classList.toggle("dark", state.darkMode);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getMyDetails.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(getMyDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = undefined;
        state.userInfo = action.payload || {};
        state.isAuthenticited = action.payload ? true : false;
      })
      .addCase(getMyDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Action creators are generated for each case reducer function
export const {
  setUserInfo,
  setLng,
  setIsDarkMode,
  themeSwitcher,
  updateProfilePicture,
} = userSlice.actions;

export default userSlice.reducer;
