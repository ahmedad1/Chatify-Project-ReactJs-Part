import {configureStore} from "@reduxjs/toolkit"

import CurrentChatReducer from "../Slices/CurrentChatSlice"
import signOutReducer from "../Slices/SignOutSlice"
import HaveFriendRequestsReducer from "../Slices/HasFriendRequestsSlice"
import RequestsReducer from "../Slices/RequestsSlice"
import FriendsReducer from "../Slices/FriendsSlice"
import OnlineFriendsReducer from "../Slices/OnlineFriendsSlice"
import MessagesReducer from "../Slices/MessagesSlice"
import SearchReducer from "../Slices/SearchSlice"

let store=configureStore({
    reducer:{
    
        currentChat:CurrentChatReducer,
        signOutFlag:signOutReducer,
        hasRequestsFlag:HaveFriendRequestsReducer,
        Requests:RequestsReducer,
        Friends:FriendsReducer,
        onlineFriends:OnlineFriendsReducer,
        messages:MessagesReducer,
        searchResult:SearchReducer
    },
    devTools:false
})
export default store