import { createSlice } from "@reduxjs/toolkit";
import { setHasFriendRequestsFlag } from "./HasFriendRequestsSlice";

let FriendsSlice=createSlice({
    name:"FriendsSlicer",
    initialState:{groups:[], hasFriendRequests: false},
    reducers:{
        addFriends:(state,action)=>{
            state.groups.push(...action.payload)
            
        },
        setHasOriginalFriendRequestsFlag:(state,action)=>{
            state.hasFriendRequests=action.payload
            return state
        },
        clearFriends:(state,action)=>{
            return {groups:[], hasFriendRequests: false}
        }
    }

})
export default FriendsSlice.reducer;
export const{addFriends,setHasOriginalFriendRequestsFlag,clearFriends} = FriendsSlice.actions