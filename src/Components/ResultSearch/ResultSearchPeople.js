import { useRef } from "react";
import sendRequestAuth from "../../HelperSharedMethods/SendRequestAuth";
import BACKEND_BASEURL from "../../backend-baseurl/backend-baseurl";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import "./ResultSearchPeople.css";
import { signOut } from "../../Redux-Toolkit/Slices/SignOutSlice";
import { useNavigate } from "react-router-dom";
import AlertSessionEnded from "../../HelperSharedMethods/AlertSessionEnded";
import FriendRequests from "../../FriendRequests/FriendRequests";
import {
  setGotRequestFlagOfSearch,
  setResultOfSearch,
} from "../../Redux-Toolkit/Slices/SearchSlice";
import Cookies from "cookie-universal";
function ResultSearchPeople(props) {
  let resultOfSearch = useSelector((x) => x.searchResult);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  async function sendRequestHandler(e) {
    const requestSpan = document.getElementById(e.target.classList[0]);
    const method = requestSpan.innerText == "+" ? "post" : "delete";
    requestSpan.innerText =
      requestSpan.innerText === "+" ? "Sending..." : "Canceling...";

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
      requestSpan.innerText =
        requestSpan.innerText == "Sending..." ? "+" : "Sent ✔";
      return;
    }
    requestSpan.innerText =
      requestSpan.innerText == "Sending..." ? "Sent ✔" : "+";
    for (let i in resultOfSearch) {
      if (resultOfSearch[i].userName == e.target.classList[0])
        dispatch(
          setGotRequestFlagOfSearch({
            userName: resultOfSearch[i].userName,
            gotRequest: true,
          })
        );
    }
  }
  const peopleJsx = resultOfSearch.map((p) => {
    return p.sentRequest == true ? (
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

        <span id={p.userName}>{p.gotRequest ? "Sent ✔" : "+"}</span>
      </li>
    );
  });
  async function searchPagination(e) {
    const pageKey = "search-people";
    if (
      parseInt(e.target.scrollTop) <
        parseInt(e.target.scrollHeight - e.target.clientHeight) ||
      isNaN(window.sessionStorage.getItem(pageKey)) ||
      +window.sessionStorage.getItem(pageKey) < 2
    ) {
      return;
    }

    const cookies = Cookies();

    // sessionStorage.setItem(pageKey, 1);

    const response = await sendRequestAuth(
      `${BACKEND_BASEURL}api/FriendRequest/people/${window.sessionStorage.getItem(
        pageKey
      )}?searchKey=${window.sessionStorage.getItem("search-key")}`,
      "get"
    );
    if (response === false) {
      cookies.removeAll();
      navigate("/");
      dispatch(signOut());
      window.sessionStorage.clear();
    } else if (response.status != 200) {
      Swal.fire({ title: "Something went wrong ... try again", icon: "error" });
    } else {
      // setResultOfSearch(response.data);
      dispatch(setResultOfSearch(response.data));
    }
    window.sessionStorage.setItem(pageKey, +window.sessionStorage.getItem(pageKey) + 1);
  }
  return (
    <>
      <ul
        className="people d-flex flex-column list-unstyled mt-4"
        onScroll={(e) => {searchPagination(e)}}
      >
        {peopleJsx}
      </ul>
    </>
  );
}
export default ResultSearchPeople;
