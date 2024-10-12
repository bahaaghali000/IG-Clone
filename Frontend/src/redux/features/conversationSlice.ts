import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { IMessage } from "../../models/Message";
import { IConversation } from "../../models/Conversation";
import { IUser } from "../../models/User";

export const getChats: any = createAsyncThunk("/conversation/get", async () => {
  try {
    const { data } = await axios.get("/chat");

    return data.data;
  } catch (e: any) {
    console.log(e.response.data.message);
  }
});

interface IConversationSlice {
  loading: boolean;
  error: undefined | string;
  onlineUsers: [];
  selectedConversation: IUser | null;
  messages: IMessage[];
  chats: IConversation[];
}

const initialState: IConversationSlice = {
  loading: false,
  error: undefined,
  onlineUsers: [],
  selectedConversation: null,
  messages: [],
  chats: [],
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setSelectedConversation: (state, action: PayloadAction<IUser>) => {
      state.selectedConversation = action.payload;
      state.messages = [];
    },
    setMessages: (state, action: PayloadAction<IMessage[]>) => {
      state.messages = action.payload;
    },
    addMessage: (
      state,
      action: PayloadAction<{ message: IMessage; conversation: IConversation }>
    ) => {
      const { message, conversation } = action.payload;

      if (conversation._id === state?.selectedConversation?._id) {
        state.messages.push(message);
      } else {
        const chat = state.chats.find((chat) => chat._id === conversation._id);
        if (chat) {
          chat.latestMessage = message.message;
        } else {
          state.chats.unshift(conversation);
        }
      }
    },
    removeMessage: (state, action: PayloadAction<string>) => {
      const messageId = action.payload;

      state.messages = state.messages.filter((m) => m._id !== messageId);
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setChats: (state, action) => {
      state.chats = action.payload;
    },

    setIsTyping: (state, action) => {
      const { sender, conversation } = action.payload;
      const chat = state.chats.findIndex((chat) => chat._id === conversation);

      if (chat !== -1) {
        state.chats = [
          ...state.chats,
          (state.chats[chat] = {
            ...state.chats[chat],
            typing: {
              sender,
              isTyping: true,
            },
          }),
        ];
      }
      // state.chats = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getChats.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(getChats.fulfilled, (state, action) => {
        state.loading = false;
        state.error = undefined;
        state.chats = action.payload || [];
      })
      .addCase(getChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setSelectedConversation,
  setMessages,
  addMessage,
  removeMessage,
  setOnlineUsers,
  setChats,
} = conversationSlice.actions;

export default conversationSlice.reducer;
