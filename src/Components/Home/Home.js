import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import Main from "../Main/Main";
import "./Home.Authenticated.css";
import Messages from "../Messages/Messages";
import MessagesHead from "../Messages/MessagesHead";
import Friends from "../Friends/Friends";
import { useEffect, useRef, useState } from "react";
import Cookies from "cookie-universal";
import checkAllCookies from "../../CookiesHandler/checkAllCookies";
import { useDispatch, useSelector } from "react-redux";
import * as signalR from "@microsoft/signalr";
import { signOut } from "../../Redux-Toolkit/Slices/SignOutSlice";
import ResultSearchPeople from "../ResultSearch/ResultSearchPeople";
import Swal from "sweetalert2";
import sendRequestAuth from "../../HelperSharedMethods/SendRequestAuth";
import BACKEND_BASEURL from "../../backend-baseurl/backend-baseurl";
import tryActiveTokens from "../../HelperSharedMethods/tryActiveTokens";
import FriendRequests from "../../FriendRequests/FriendRequests";
function Home(props) {
  return (
    <>{checkAllCookies() ? <HomeAutenticated /> : <HomeNotAuthenticated />}</>
  );
}

var HomeNotAuthenticated = (props) => {
  return (
    <>
      <Main>
        <h2 className="text-info text-center">
          Chatify for messages & video calls
        </h2>
        <p className=" mt-4 subTitle text-center">
          Chat with your family, friends and anyone, You can also share your own
          PC screen if you want to your peer
        </p>
        <Link to="/sign-up" className="btn btn-outline-warning mt-4">
          {" "}
          Join us
        </Link>
      </Main>
    </>
  );
};

var HomeAutenticated = (props) => {
  const messagesSectionRef = useRef();
  const peopleSectionRef = useRef();
  const backend = BACKEND_BASEURL;
  let searchRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cookies = Cookies();
  let parent1Ref=useRef()
  let parent2Ref=useRef()
  const [conn, setConn] = useState(null);
  const [newOnlineFriend, setNewOnlineFriend] = useState([]);
  const [resultOfSearch, setResultOfSearch] = useState([]);
  const [currentSection, setCurrentSection] = useState(false); //false : friends , true: friend-requests
  async function connectToSignalR() {
    const conn = new signalR.HubConnectionBuilder()
      .withUrl(`${backend}chat`, { withCredentials: true })
      .build();
    try {
      await conn.start();
      setConn(conn);
    } catch (e) {
      if (e.toString().includes("Status code '401'")) {
        let result = await tryActiveTokens();
        if (!result) {
          navigate("/");
          dispatch(signOut());
          console.clear();
          return null;
        }
        await connectToSignalR();
      }
    }
  }
  useEffect((_) => {
    connectToSignalR();
    return async function () {
      await conn?.stop();
    };
  }, []);

  conn?.on("isActive", (userName, firstName, lastName) => {
    if (userName != cookies.get("userName")) {
      newOnlineFriend.push({
        userName: userName,
        firstName: firstName,
        lastName: lastName,
      });
      setNewOnlineFriend(newOnlineFriend);
    }
  });
  async function handleSearchButton(e, event) {
    if (!e.length) return;
    const pageKey = "search-people";

    sessionStorage.setItem(pageKey, 1);
    document.querySelectorAll(".fa-spinner")[1].classList.remove("d-none");
    const response = await sendRequestAuth(
      `${backend}api/FriendRequest/people/${sessionStorage.getItem(
        pageKey
      )}?searchKey=${e}`,
      "get"
    );
    document.querySelectorAll(".fa-spinner")[1].classList.add("d-none");

    if (response === false) {
      cookies.removeAll();
      navigate("/");
      dispatch(signOut());
      sessionStorage.clear();
    } else if (response.status != 200) {
      Swal.fire({ title: "Something went wrong ... try again", icon: "error" });
    } else {
      setResultOfSearch(response.data);
    }
    sessionStorage.setItem(pageKey, +sessionStorage.getItem(pageKey) + 1);
  }
  return (
    <>
      <div className="Auth px-lg-5 mt-lg-0 mt-5">
        <div className=" row m-lg-auto pt-lg-5 px-lg-5">
          <div className="col-lg-8 d-lg-block d-none" ref={messagesSectionRef}>
            {/* <MessagesHead dest={"Mohamed"} isTyping={true}/> */}
            <MessagesHead
              messagesSection={messagesSectionRef}
              peopleSection={peopleSectionRef}
            />
            <Messages messages={[{ id: 1, sender: "You", content: "hi" }]} />
          </div>
          <div className="col-lg-4 col-12" ref={peopleSectionRef}>
            <h3 className="text-info bg-glass p-3 rounded px-4">People </h3>
            <div className="peopleSection bg-glass p-4 mt-3 rounded d-flex flex-column  ">
              <div className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control search "
                  placeholder="Search for New people"
                  onChange={(e) => {
                    if (e.target.value.length == 0) setResultOfSearch([]);
                  }}
                  ref={searchRef}
                />
                <button
                  type="button"
                  className=" search-btn btn btn-outline-info d-flex align-items-center"
                  onClick={async (e) => {
                    await handleSearchButton(searchRef.current.value, e);
                  }}
                >
                  Search
                  <i className="fa-solid fa-spinner fa-spin ms-2 fa-lg d-none"></i>
                </button>
              </div>
              <div className="mt-3 d-flex justify-content-around">
                <div
                  className="parent-of-nav-sidebar parent1 display-parent"
                  ref={parent1Ref}
                  onClick={(e) => {
                   if(!parent1Ref.current.classList.contains("display-parent")){
                    parent1Ref.current.classList.add("display-parent");
                    parent2Ref.current.classList.remove("display-parent")
                   }
                    setCurrentSection(false);
                  }}
                >
                  <a className="text-decoration-none nav-sidebar">Friends</a>
                </div>
                <div
                  className="parent-of-nav-sidebar parent2"
                  ref={parent2Ref}
                  onClick={(e) => {
                    if(!parent2Ref.current.classList.contains("display-parent"))
                    parent2Ref.current.classList.add("display-parent");
                    parent1Ref.current.classList.remove("display-parent")
                    setCurrentSection(true);
                  }}
                >
                  <a className="text-decoration-none nav-sidebar">
                    Friend Requests
                  </a>
                </div>
              </div>

              {resultOfSearch.length !== 0 ? (
                <ResultSearchPeople people={resultOfSearch} />
              ) : !currentSection ? (
                <Friends
                  messagesSection={messagesSectionRef}
                  peopleSection={peopleSectionRef}
                  onlineFriends={newOnlineFriend} //dynamic
                  friends={[
                    //dynamic
                    {
                      groupId: "aaaa",
                      firstName: "Samy",
                      lastName: "Omar",
                      userName: "SamySY0",
                    },
                    {
                      groupId: "wwww",
                      firstName: "Mohamed",
                      lastName: "Omar",
                      userName: "mohamedmd0",
                    },
                  ]}
                />
              ) : (
                <FriendRequests />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
