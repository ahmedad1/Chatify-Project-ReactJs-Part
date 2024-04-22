
import {createSlice}from "@reduxjs/toolkit"

let backendOriginSlice=createSlice({
name:"backendOriginSlice",
initialState:"https://localhost:7155/api/Account/",
reducers:{
setBackendOrigin:(state,action)=>{
    
return action.payload
}
}
})
export default backendOriginSlice.reducer
export const {setBackendOrigin}=backendOriginSlice.actions