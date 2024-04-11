import {configureStore} from "@reduxjs/toolkit"
import BackendOriginReducer from "../Slices/BackendOriginSlice"
import CurrentChatReducer from "../Slices/CurrentChatSlice"

let store=configureStore({
    reducer:{
        backendOrigin:BackendOriginReducer,
        currentChat:CurrentChatReducer
    }
})
export default store