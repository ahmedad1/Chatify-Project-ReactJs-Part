import { createSlice } from "@reduxjs/toolkit";

let onlineFriendsSlice=createSlice({
    name:"onlineFriends",
    initialState:[],
    reducers:{
        addOnlineFriends:(state,action)=>{
            state.push(...action.payload)
        },
        removeOnlineFriend:(state,action)=>{
            return state.filter(e=>e!=action.payload)
        },
        clearOnlineFriends:(state,action)=>{
            return [];
        }
    }
})
export default onlineFriendsSlice.reducer
export const {addOnlineFriends,removeOnlineFriend,clearOnlineFriends}=onlineFriendsSlice.actions