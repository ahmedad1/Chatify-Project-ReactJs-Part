import { createSlice } from "@reduxjs/toolkit";

const HasFriendRequestsSlice=createSlice({
    name:"HaveFriendRequests",
    initialState:false,
    reducers:{
        setHasFriendRequestsFlag:(state,action)=>{
            return action.payload;
        }
    }
})
export default HasFriendRequestsSlice.reducer
export const{setHasFriendRequestsFlag}=HasFriendRequestsSlice.actions