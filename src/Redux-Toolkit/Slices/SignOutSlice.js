import { createSlice } from "@reduxjs/toolkit";

let signOutSlice=createSlice({
    name:"signOutSlice",
    initialState:false,
    reducers:{
        signOut:(state,action)=>{
            return !state;
        }
    }
})
export default signOutSlice.reducer
export const{signOut}=signOutSlice.actions