import { useRef } from "react";
import sendRequestAuth from "../../HelperSharedMethods/SendRequestAuth";
import BACKEND_BASEURL from "../../backend-baseurl/backend-baseurl";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { signOut } from "../../Redux-Toolkit/Slices/SignOutSlice";
import { useNavigate } from "react-router-dom";
import AlertSessionEnded from "../../HelperSharedMethods/AlertSessionEnded";
import FriendRequests from "../../FriendRequests/FriendRequests";

function ResultSearchPeople(props) {
  let requestSpan = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  async function sendRequestHandler(e) {
    const method = requestSpan.current.innerText == "+" ? "post" : "delete";
    requestSpan.current.innerText =
      requestSpan.current.innerText === "+" ? "Sending..." : "Canceling...";
    const result = await sendRequestAuth(
      `${BACKEND_BASEURL}api/FriendRequest`,
      method,
      {
        userName: e.target.classList[0],
      }
    );

    if (!result) {
      AlertSessionEnded(navigate, dispatch, signOut);
      return;
    } else if (result.status != 200) {
      Swal.fire("Something went wrong");
      requestSpan.current.innerText =
        requestSpan.current.innerText == "Sending..." ? "+" : "Sent ✔";
      return;
    }
    requestSpan.current.innerText =
      requestSpan.current.innerText == "Sending..." ? "Sent ✔" : "+";
  }
  const peopleJsx = props.people?.map((p) => {
    return p.sentRequest==true ? (
      <FriendRequests key={p.userName} renderProps={[p]} />
    ) : (
      <li
        key={p.userName}
        className={`${p.userName} person form-control mt-2 d-flex justify-content-between`}
        onClick={async (e) => {
          await sendRequestHandler(e);
        }}
      >
        <span className={p.userName}>
          <i className={`${p.userName} fa-regular fa-user`}></i>{" "}
          <span className={`${p.userName} ms-2`}>
            {p.firstName} {p.lastName} - @{p.userName}{" "}
          </span>
        </span>

        <span ref={requestSpan}>{p.gotRequest ? "Sent ✔" : "+"}</span>
      </li>
    );
  });
  return (
    <>
      <ul className="people d-flex flex-column list-unstyled mt-4">
        {peopleJsx}
      </ul>
    </>
  );
}
export default ResultSearchPeople;
