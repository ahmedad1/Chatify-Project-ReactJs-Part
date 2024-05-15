import Swal from "sweetalert2"
import { clearCurrentChat } from "../Redux-Toolkit/Slices/CurrentChatSlice"
import { clearRequests } from "../Redux-Toolkit/Slices/RequestsSlice"
import { clearOnlineFriends } from "../Redux-Toolkit/Slices/OnlineFriendsSlice"
import { clearHasFriendRequests } from "../Redux-Toolkit/Slices/HasFriendRequestsSlice"
import { clearFriends } from "../Redux-Toolkit/Slices/FriendsSlice"
import { ClearMessages } from "../Redux-Toolkit/Slices/MessagesSlice"

function AlertSessionEnded(navigate,dispatch,signOut){
    Swal.fire({title:"Your session has been ended",icon:"warning"}).then(res=>{
        if(res.isConfirmed||res.isDismissed){
          navigate("/")
          dispatch(signOut())
          dispatch(clearRequests())
          dispatch(clearOnlineFriends())
          dispatch(clearHasFriendRequests())
          dispatch(clearFriends())
          dispatch(clearCurrentChat())
          dispatch(ClearMessages())
          
        }
      })
}
export default AlertSessionEnded