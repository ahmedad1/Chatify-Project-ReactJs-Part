import {configureStore} from "@reduxjs/toolkit"
import BackendOriginReducer from "../Slices/BackendOriginSlice"
import CurrentChatReducer from "../Slices/CurrentChatSlice"
import signOutReducer from "../Slices/SignOutSlice"

let store=configureStore({
    reducer:{
        backendOrigin:BackendOriginReducer,
        currentChat:CurrentChatReducer,
        signOutFlag:signOutReducer
    }
})
export default store