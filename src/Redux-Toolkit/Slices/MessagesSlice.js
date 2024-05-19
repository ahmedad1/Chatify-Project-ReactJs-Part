import { createSlice } from "@reduxjs/toolkit";

const MessagesSlice=createSlice({
name:"MessagesSlice",
initialState:[],
reducers:{
    AddMessages:(state,action)=>{
        return [...action.payload,...state]
    },
  
    ClearMessages:(state,action)=>{
        return []
    }

}

})
export default MessagesSlice.reducer
export const{AddMessages,ClearMessages}=MessagesSlice.actions