import { createSlice } from "@reduxjs/toolkit";

const MessagesSlice=createSlice({
name:"MessagesSlice",
initialState:[],
reducers:{
    AddMessages:(state,action)=>{
        return [...state,...action.payload]
    },
    ClearMessages:(state,action)=>{
        return []
    }

}

})
export default MessagesSlice.reducer
export const{AddMessages,ClearMessages}=MessagesSlice.actions