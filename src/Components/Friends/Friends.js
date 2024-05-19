import { useDispatch, useSelector } from "react-redux";
import { clearCurrentChat, setCurrentChat } from "../../Redux-Toolkit/Slices/CurrentChatSlice";
import { useEffect, useState } from "react";
import sendRequestAuth from "../../HelperSharedMethods/SendRequestAuth";
import BACKEND_BASEURL from "../../backend-baseurl/backend-baseurl";
import AlertSessionEnded from "../../HelperSharedMethods/AlertSessionEnded";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { signOut } from "../../Redux-Toolkit/Slices/SignOutSlice";
import { setHasFriendRequestsFlag } from "../../Redux-Toolkit/Slices/HasFriendRequestsSlice";
import {
  addFriends,
  setHasOriginalFriendRequestsFlag,
  setHasUnreadMessagesFlag,
} from "../../Redux-Toolkit/Slices/FriendsSlice";
import { Puff, ThreeDots } from "react-loader-spinner";
import { ClearMessages } from "../../Redux-Toolkit/Slices/MessagesSlice";

function Friends(props) {
  const [hasEnabledLoader, setHasEnabledLoader] = useState(false);
  const currentChat=useSelector(x=>x.currentChat)
  const messages=useSelector(x=>x.messages)
  const dispatch = useDispatch();
  let onlineFriends = useSelector((x) => x.onlineFriends);

  const navigate = useNavigate();
  let FriendsSelector = useSelector((x) => x.Friends);
  let mediaQuery = matchMedia("(min-width:992px)");
  function showMessagesHandler(obj) {
    if (!mediaQuery.matches) {
      props.messagesSection.current.classList.remove("d-none");
      props.peopleSection.current.classList.add("d-none");
    }
    if(currentChat.groupId===obj.id)
      return
    dispatch(ClearMessages())
    dispatch(
      setCurrentChat({
        firstName: obj.users[0].firstName,
        lastName: obj.users[0].lastName,
        userName: obj.users[0].userName,
        groupId:obj.id
      })
      
    );
    
    props.conn?.invoke("MakeMessagesRead",obj.id)
    dispatch(setHasUnreadMessagesFlag({groupId:obj.id,isRead:true}))
    
  }
  useEffect((_) => {
    if (FriendsSelector.groups.length == 0) {
      setHasEnabledLoader(true);
      sendRequestAuth(`${BACKEND_BASEURL}api/Chat/groups`, "get").then(
        (res) => {
          if (!res) {
            AlertSessionEnded(navigate, dispatch, signOut);
            return;
          } else if (res.status !== 200) {
            Swal.fire({ title: "Something Went Wrong", icon: "error" });
            return;
          } else {
            dispatch(addFriends(res.data.groups));
            dispatch(
              setHasOriginalFriendRequestsFlag(res.data.hasFriendRequests)
            );
            dispatch(setHasFriendRequestsFlag(res.data.hasFriendRequests));
          }
          setHasEnabledLoader(false);
        }
      );
    } else {
      dispatch(setHasFriendRequestsFlag(FriendsSelector.hasFriendRequests));
    }
  }, []);

  let friendsJSX = FriendsSelector.groups.map((f) => {
    return (
      <li
        key={f.users[0].userName}
        id={f.id}
        className="person form-control mt-2 d-flex justify-content-between"
        onClick={(_) => {
          showMessagesHandler(f);
        }}
      >
        <span className="text-center"style={{position:"relative"}}>
        <span style={{position:"absolute",top:"-12px",left:"-16px",background:"#dc3545",borderRadius:"50%",width:"12px",height:"12px",display:!f.isRead?"inline":"none"}}></span>
          <i className="fa-regular fa-user"></i>{" "}
          <small className="ms-2  ">
            <span>
              {f.users[0].firstName} {f.users[0].lastName}{" "}
            </span>
            -<small> 
              @{f.users[0].userName}
            </small>
            {/* <span className="ms-1 text-danger"style={{fontSize:"1.1em"}}>()</span> */}
           
            {/* {onlineFriends.some((x) => x.userName == f.userName) && ( */}
            {/*)}*/}
          </small>
          
        </span>
        {onlineFriends.some((e) => e === f.users[0].userName) && (
          <span className="text-success ms-2 fw-bold">
            Active
          </span>
        )}
      </li>
    );
  });
  return (
    <>
      {hasEnabledLoader ? (
        <ul className="people d-flex justify-content-center align-items-center list-unstyled mt-4">
          <ThreeDots
            visible={hasEnabledLoader}
            height="70"
            width="70"
            color="#0dcaf0"
            radius="9"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </ul>
      ) : (
        <ul className="people d-flex flex-column list-unstyled mt-4">
          {friendsJSX}
        </ul>
      )}
    </>
  );
}
export default Friends;
