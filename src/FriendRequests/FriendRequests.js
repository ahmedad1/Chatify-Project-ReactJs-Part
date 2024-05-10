import { useEffect, useRef, useState } from "react";
import sendRequestAuth from "../HelperSharedMethods/SendRequestAuth";
import BACKEND_BASEURL from "../backend-baseurl/backend-baseurl";
import AlertSessionEnded from "../HelperSharedMethods/AlertSessionEnded";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signOut } from "../Redux-Toolkit/Slices/SignOutSlice";
import Swal from "sweetalert2";
import "./FriendRequest.css";

function FriendRequests(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [requests, setRequests] = useState([]);
  
  useEffect((_) => {
   
    sessionStorage.setItem("friendRequestList", 1);
    sendRequestAuth(`${BACKEND_BASEURL}api/FriendRequest/page/1`, "get").then(
      (res) => {
        if (!res) {
          AlertSessionEnded(navigate, dispatch, signOut);
          return;
        } else if (res.status != 200) {
          Swal.fire({ title: "Something Went Wrong", icon: "error" });
          return;
        } else {
          setRequests(res.data);
        }
      }
    );
  }, []);
async function HandleResponse(e,response){
 const userName=e.target.classList[0] 
 console.log(userName);
const res=await sendRequestAuth(`${BACKEND_BASEURL}api/FriendRequest/response`,"post",{
    userName:userName,
    isAccepted:response
})
console.log(res);
if (!res) {
    AlertSessionEnded(navigate, dispatch, signOut);
    return;
  } else if (res.status != 200) {
    Swal.fire({ title: "Something Went Wrong", icon: "error" });
    return;
  } else {
    document.getElementById(userName).remove()
  }
}
  return (
    <>
      <ul className="people d-flex flex-column list-unstyled mt-4">
        {requests?.map((r) => {
          return (
            <li
              key={r.userName}
              className="request form-control mt-2 d-flex justify-content-between"
              id={r.userName}  
            >
              <span className="text-center request-info">
                <i className="fa-regular fa-user"></i>{" "}
                <small className="ms-2  ">
                  <span>
                    {r.firstName} {r.lastName}{" "}
                  </span>
                  -<small> @{r.userName}</small>
                </small>
              </span>
              <small
                id="responseBtns"
                className="d-flex justify-content-between w-25 align-items-center response-parent"
              >
                <a className={`${r.userName} text-decoration-none response-button`}onClick={async e=>{
                    await HandleResponse(e,true)
                }}>Accept</a>
                <a className={`${r.userName} text-decoration-none response-button`}onClick={async e=>{
                    await HandleResponse(e,false)
                }}>Reject</a>
              </small>
            </li>
          );
        })}
      </ul>
    </>
  );
}
export default FriendRequests;
