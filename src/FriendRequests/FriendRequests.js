import { useEffect } from "react";
import sendRequestAuth from "../HelperSharedMethods/SendRequestAuth";
import BACKEND_BASEURL from "../backend-baseurl/backend-baseurl";
import AlertSessionEnded from "../HelperSharedMethods/AlertSessionEnded";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../Redux-Toolkit/Slices/SignOutSlice";
import Swal from "sweetalert2";
import "./FriendRequest.css";
import {
  clearRequests,
  removeRequest,
  setNewRequest,
} from "../Redux-Toolkit/Slices/RequestsSlice";
import { setHasFriendRequestsFlag } from "../Redux-Toolkit/Slices/HasFriendRequestsSlice";

function FriendRequests(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let requests = useSelector((x) => x.Requests);
  async function fetchFriendRequests(pageNum) {
    let res = await sendRequestAuth(
      `${BACKEND_BASEURL}api/FriendRequest/page/${pageNum}`,
      "get"
    );

    if (!res) {
      AlertSessionEnded(navigate, dispatch, signOut);
      return;
    } else if (res.status != 200) {
      Swal.fire({ title: "Something Went Wrong", icon: "error" });
      return;
    } else {
      if (res?.data.length !== 0)
        sessionStorage.setItem(
          "friendRequestList",
          +sessionStorage.getItem("friendRequestList") + 1
        );
      dispatch(setNewRequest(res.data));
    }
  }
  useEffect((_) => {
    if (requests.length == 0 && !props?.renderProps) {
      sessionStorage.setItem("friendRequestList", 1);
      fetchFriendRequests(1);
    }
  }, []);
  async function HandleResponse(e, response) {
    const userName = e.target.classList[0];

    const res = await sendRequestAuth(
      `${BACKEND_BASEURL}api/FriendRequest/response`,
      "post",
      {
        userName: userName,
        isAccepted: response,
      }
    );
    if (!res) {
      AlertSessionEnded(navigate, dispatch, signOut);
      return;
    } else if (res.status != 200) {
      Swal.fire({ title: "Something Went Wrong", icon: "error" });
      return;
    } else {
      dispatch(removeRequest(userName));
      if (props?.renderProps) {
        document.getElementById(userName).remove();
        props = undefined;
        dispatch(setHasFriendRequestsFlag(requests.length > 0));
      }
    }
  }
  async function handlePaginationOfFriendRequests(e) {
    const pageNum = sessionStorage.getItem("friendRequestList");
    if (
      e.target.scrollTop < e.target.scrollHeight - e.target.clientHeight ||
      isNaN(pageNum) ||
      +pageNum < 2
    )
      return;
    await fetchFriendRequests(+pageNum);
  }
  return (
    <>
      {!props?.renderProps ? (
        <ul
          onScroll={async (e) => {
            await handlePaginationOfFriendRequests(e);
          }}
          className="people d-flex flex-column list-unstyled mt-4"
        >
          {requests.map((r) => {
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
                  <a
                    className={`${r.userName} text-decoration-none response-button`}
                    onClick={async (e) => {
                      await HandleResponse(e, true);
                    }}
                  >
                    Accept
                  </a>
                  <a
                    className={`${r.userName} text-decoration-none response-button`}
                    onClick={async (e) => {
                      await HandleResponse(e, false);
                    }}
                  >
                    Reject
                  </a>
                </small>
              </li>
            );
          })}
        </ul>
      ) : (
        <>
          {props.renderProps.map((r) => {
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
                  <a
                    className={`${r.userName} text-decoration-none response-button`}
                    onClick={async (e) => {
                      await HandleResponse(e, true);
                    }}
                  >
                    Accept
                  </a>
                  <a
                    className={`${r.userName} text-decoration-none response-button`}
                    onClick={async (e) => {
                      await HandleResponse(e, false);
                    }}
                  >
                    Reject
                  </a>
                </small>
              </li>
            );
          })}
        </>
      )}
    </>
  );
}
export default FriendRequests;
