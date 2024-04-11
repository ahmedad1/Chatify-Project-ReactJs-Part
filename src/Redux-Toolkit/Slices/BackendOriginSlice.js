
import {createSlice}from "@reduxjs/toolkit"

let backendOriginSlice=createSlice({
name:"backendOriginSlice",
initialState:window.location.origin,
reducers:{
setBackendOrigin:(state,action)=>{
    
return action.payload
}
}
})
export default backendOriginSlice.reducer
export const {setBackendOrigin}=backendOriginSlice.actions