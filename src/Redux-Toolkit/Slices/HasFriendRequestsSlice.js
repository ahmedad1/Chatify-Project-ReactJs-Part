import { createSlice } from "@reduxjs/toolkit";

const HasFriendRequestsSlice=createSlice({
    name:"HaveFriendRequests",
    initialState:false,
    reducers:{
        setHasFriendRequestsFlag:(state,action)=>{
            return action.payload;
        },
        clearHasFriendRequests:(state,action)=>{
            return false
        }
    }
})
export default HasFriendRequestsSlice.reducer
export const{setHasFriendRequestsFlag,clearHasFriendRequests}=HasFriendRequestsSlice.actions