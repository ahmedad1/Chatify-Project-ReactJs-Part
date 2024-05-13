import { createSlice } from "@reduxjs/toolkit";


let RequestsSlice=createSlice({
    name:"RequestsSlice",
    initialState:[],
    reducers:{
        setNewRequest:(state,action)=>{
            state.push(...action.payload);
        },
        removeRequest:(state,action)=>{
            return state.filter(x=>x.userName!=action.payload)
        },
        clearRequests:(state,action)=>{
            return []
        }

    }

})
export default RequestsSlice.reducer
export const {setNewRequest,removeRequest,clearRequests}=RequestsSlice.actions