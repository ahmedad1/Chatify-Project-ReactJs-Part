import { createSlice } from "@reduxjs/toolkit";

let SearchSlice=createSlice({
    name:"SearchSlice",
    initialState:[],
    reducers:{
        setResultOfSearch:(state,action)=>{
            return [...state,...action.payload]
        },
        removeFromResultOfSearch:(state,action)=>{
            return state.filter(x=>x.userName!=action.payload)
        },
        setGotRequestFlagOfSearch:(state,action)=>{
            state.map(x=>{if(x.userName==action.payload.userName)x.gotRequest=action.payload.gotRequest;return x})    
        },
        ClearResultOfSearch:(state,action)=>{
            return []
        }
    }
})
export default SearchSlice.reducer
export const{setResultOfSearch,removeFromResultOfSearch,setGotRequestFlagOfSearch,ClearResultOfSearch}=SearchSlice.actions
