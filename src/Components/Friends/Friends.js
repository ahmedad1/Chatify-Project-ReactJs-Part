import { useDispatch, useSelector } from "react-redux";
import { setCurrentChat } from "../../Redux-Toolkit/Slices/CurrentChatSlice";
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
} from "../../Redux-Toolkit/Slices/FriendsSlice";
import { ThreeDots } from "react-loader-spinner";

function Friends(props) {
  const [hasEnabledLoader, setHasEnabledLoader] = useState(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  let FriendsSelector = useSelector((x) => x.Friends);
  let mediaQuery = matchMedia("(min-width:992px)");
  function showMessagesHandler(obj) {
    if (!mediaQuery.matches) {
      props.messagesSection.current.classList.remove("d-none");
      props.peopleSection.current.classList.add("d-none");
    }
    dispatch(
      setCurrentChat({
        firstName: obj.users[0].firstName,
        lastName: obj.users[0].lastName,
        userName: obj.users[0].userName,
      })
    );
  }
  useEffect((_) => {
    if (FriendsSelector.groups.length == 0){
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
          setHasEnabledLoader(false)
        }
      );
    }
    else {
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
        <span className="text-center">
          <i className="fa-regular fa-user"></i>{" "}
          <small className="ms-2  ">
            <span>
              {f.users[0].firstName} {f.users[0].lastName}{" "}
            </span>
            -<small> @{f.users[0].userName}</small>
            {props.onlineFriends?.some((x) => x.userName == f.userName) && (
              <i class="fa-solid fa-circle" style="color: #04ff00;"></i>
            )}
          </small>
        </span>
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
