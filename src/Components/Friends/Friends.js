import { useDispatch } from "react-redux";
import { setCurrentChat } from "../../Redux-Toolkit/Slices/CurrentChatSlice";
import { useEffect, useState } from "react";
import sendRequestAuth from "../../HelperSharedMethods/SendRequestAuth";
import BACKEND_BASEURL from "../../backend-baseurl/backend-baseurl";
import AlertSessionEnded from "../../HelperSharedMethods/AlertSessionEnded";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { signOut } from "../../Redux-Toolkit/Slices/SignOutSlice";
function Friends(props) {
  const dispatch = useDispatch();
  const [friends,setFriends]=useState([])
  const navigate=useNavigate()
  let mediaQuery=matchMedia("(min-width:992px)")
  function showMessagesHandler(obj) {
    if(!mediaQuery.matches){
      props.messagesSection.current.classList.remove("d-none")
      props.peopleSection.current.classList.add("d-none")
      
    }
    dispatch(
      setCurrentChat({
        firstName: obj.users[0].firstName,
        lastName: obj.users[0].lastName,
        userName: obj.users[0].userName,
      })
    );
  }
  useEffect(_=>{
    sendRequestAuth(`${BACKEND_BASEURL}api/Chat/groups`,"get").then(res=>{
    if (!res) {
      AlertSessionEnded(navigate, dispatch, signOut);
      return;
    } else if (res.status !== 200) {
      console.log(res);
      Swal.fire({ title: "Something Went Wrong", icon: "error" });
      return;
    } else {
      setFriends(res.data);
    }})
  },[])

  let friendsJSX = friends?.map((f) => {
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
            {props.onlineFriends?.some(x=>x.userName==f.userName)&&<i class="fa-solid fa-circle" style="color: #04ff00;"></i>}
          </small>
        </span>
      </li>
    );
  });
  return (
    <ul className="people d-flex flex-column list-unstyled mt-4">
      {friendsJSX}
    </ul>
  );
}
export default Friends;
