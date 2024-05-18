import { createSlice } from "@reduxjs/toolkit";
let CurrentChatSlice = createSlice({
  name: "CurrentChatSlice",
  initialState: {},
  reducers: {
    setCurrentChat: (state, action) => {
      return action.payload;
    },
    setIsTypingFlag:(state,action)=>{
      state.isTyping=action.payload
      return state
    },
    getCurrentChat: (state, action) => {
      return state?.payload.userName;
    },
    clearCurrentChat:(state,action)=>{
      return {};
    }
  },
});
export default CurrentChatSlice.reducer;
export const { setCurrentChat, getCurrentChat,clearCurrentChat,setIsTypingFlag } = CurrentChatSlice.actions;
