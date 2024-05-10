import {configureStore} from "@reduxjs/toolkit"

import CurrentChatReducer from "../Slices/CurrentChatSlice"
import signOutReducer from "../Slices/SignOutSlice"

let store=configureStore({
    reducer:{
    
        currentChat:CurrentChatReducer,
        signOutFlag:signOutReducer
    }
})
export default store