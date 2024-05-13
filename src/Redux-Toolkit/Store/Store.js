import {configureStore} from "@reduxjs/toolkit"

import CurrentChatReducer from "../Slices/CurrentChatSlice"
import signOutReducer from "../Slices/SignOutSlice"
import HaveFriendRequestsReducer from "../Slices/HasFriendRequestsSlice"
import RequestsReducer from "../Slices/RequestsSlice"
import FriendsReducer from "../Slices/FriendsSlice"

let store=configureStore({
    reducer:{
    
        currentChat:CurrentChatReducer,
        signOutFlag:signOutReducer,
        hasRequestsFlag:HaveFriendRequestsReducer,
        Requests:RequestsReducer,
        Friends:FriendsReducer
    }
})
export default store