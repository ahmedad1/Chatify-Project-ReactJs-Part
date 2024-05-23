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
import { Oval, Puff } from "react-loader-spinner";
import { setHasFriendRequestsFlag } from "../../Redux-Toolkit/Slices/HasFriendRequestsSlice";
import { removeRequest, setNewRequest } from "../../Redux-Toolkit/Slices/RequestsSlice";
import { addFriends, setHasUnreadMessagesFlag } from "../../Redux-Toolkit/Slices/FriendsSlice";
import { addOnlineFriends, removeOnlineFriend } from "../../Redux-Toolkit/Slices/OnlineFriendsSlice";
import { AddMessages, AddRealTimeMessages, MakeMessagesOfGroupRead } from "../../Redux-Toolkit/Slices/MessagesSlice";
import { setIsTypingFlag } from "../../Redux-Toolkit/Slices/CurrentChatSlice";
import { ClearResultOfSearch, removeFromResultOfSearch, setGotRequestFlagOfSearch, setResultOfSearch } from "../../Redux-Toolkit/Slices/SearchSlice";
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
          Chat with your family, friends and anyone, Join us and send a friend request to anyone to start chatting
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
  let parent1Ref = useRef();
  let parent2Ref = useRef();
  const [conn, setConn] = useState(null);
  const [searchSpinner, setSearchSpinner] = useState(false);
  const [searched, setSearched] = useState(false);

  // const [resultOfSearch, setResultOfSearch] = useState([]);
  // let resultOfSearchRef=useRef(resultOfSearch)
  let hasRequests=useSelector(x=>x.hasRequestsFlag)
  let newRequestSignal=useSelector(x=>x.newRequestSignal)
  let currentChat=useSelector(x=>x.currentChat)
  let currentChatRef=useRef(currentChat)
  const [currentSection, setCurrentSection] = useState(false); //false : friends , true: friend-requests
  let currentSectionRef=useRef(currentSection);
  let searchedRef=useRef(searched)
  useEffect(_=>{
   currentSectionRef.current=currentSection
   searchedRef.current=searched
   currentChatRef.current=currentChat
  //  resultOfSearchRef.current=resultOfSearch
  })
  async function connectToSignalR() {
    const conn = new signalR.HubConnectionBuilder()
      .withUrl(`${backend}chat`
      // , { withCredentials: true }

      )
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
    if(conn ===null)
    connectToSignalR()
    conn?.on("newOneActive", (userName, firstName, lastName) => {
      if (userName != cookies.get("userName")) {
      dispatch(addOnlineFriends([userName]))
      }
    });
    conn?.on("allActiveUsers",(userNames)=>{
      dispatch(addOnlineFriends(userNames))
    })
    conn?.on("isNotActive",(userName)=>{
      dispatch(removeOnlineFriend(userName))
    })
    conn?.on("friendRequest",(userName,firstName,lastName)=>{
      
      dispatch(setNewRequest([{userName:userName,firstName:firstName,lastName:lastName}]))
      if(!currentSectionRef.current){
        dispatch(setHasFriendRequestsFlag(true))
        
      }
  
    })
    conn?.on("friendRequestCancelled",(userName)=>{
      dispatch(removeRequest(userName))
      if(!currentSectionRef.current){
        dispatch(setHasFriendRequestsFlag(false))

      }
    })
    conn?.on("requestAccepted",(userName,firstName,lastName,groupId)=>{
      if(searchedRef.current){
        
        dispatch(removeFromResultOfSearch(userName))
      }
      dispatch(addFriends([{
        id:groupId,
        isRead:true,
        users:[{userName:userName,firstName:firstName,lastName:lastName}]
      }]))
     
    })
    conn?.on("requestRejected",(userName)=>{
      
      if(searchedRef.current){
       
        dispatch(setGotRequestFlagOfSearch({userName:userName,gotRequest:false}))
       }
    })
 
    conn?.on("newMessage",(userName,message,groupId,messageid)=>{
   
      if(currentChatRef.current.groupId==groupId){
      dispatch(setIsTypingFlag(false))
      conn.invoke("MakeMessagesRead",groupId)
      dispatch(AddRealTimeMessages([{id:messageid,message:message,userName:userName,groupId:groupId,isRead:true}]))

      }else{
        dispatch(setHasUnreadMessagesFlag({groupId:groupId,isRead:false}))
      }
    })
    return async function () {
      await conn?.stop();
    };
  }, [conn]);


  async function handleSearchButton(e, event) {
    if (!e.length) return;
    const pageKey = "search-people";

    sessionStorage.setItem(pageKey, 1);
    sessionStorage.setItem("search-key",e);
    setSearchSpinner(true);
    const response = await sendRequestAuth(
      `${backend}api/FriendRequest/people/${sessionStorage.getItem(
        pageKey
      )}?searchKey=${e}`,
      "get"
    );
    setSearchSpinner(false);

    if (response === false) {
      cookies.removeAll();
      navigate("/");
      dispatch(signOut());
      sessionStorage.clear();
    } else if (response.status != 200) {
      Swal.fire({ title: "Something went wrong ... try again", icon: "error" });
    } else {
      // setResultOfSearch(response.data);
      dispatch(setResultOfSearch(response.data))
    }
    setSearched(true);
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
              conn={conn}
            />
            <Messages conn={conn}/>
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
                    if (e.target.value.length <= 1 && searched) {
                      dispatch(ClearResultOfSearch())
                      setSearched(false);
                    }
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
                  <Oval
                    wrapperClass={"ms-2 search-spinner"}
                    secondaryColor="#000"
                    visible={searchSpinner}
                    height="18"
                    width="18"
                    color="#0dcaf0"
                    ariaLabel="oval-loading"
                    wrapperStyle={{}}
                  />
                  {/* <i className="fa-solid fa-spinner fa-spin ms-2 fa-lg d-none"></i> */}
                </button>
              </div>
              <div className="mt-3 d-flex justify-content-around">
                <div
                  className="parent-of-nav-sidebar parent1 display-parent"
                  ref={parent1Ref}
                  onClick={(e) => {
                    if (
                      !parent1Ref.current.classList.contains("display-parent")
                    ) {
                      parent1Ref.current.classList.add("display-parent");
                      parent2Ref.current.classList.remove("display-parent");
                    }
                    setCurrentSection(false);
                  }}
                >
                  <a className="text-decoration-none nav-sidebar">Friends</a>
                </div>
                <div
                  className="parent-of-nav-sidebar parent2 d-flex flex-row-reverse justify-content-between"
                  ref={parent2Ref}
                  onClick={(e) => {
                    if (
                      !parent2Ref.current.classList.contains("display-parent")
                    )
                      parent2Ref.current.classList.add("display-parent");
                    parent1Ref.current.classList.remove("display-parent");
                    setCurrentSection(true);
                    dispatch(setHasFriendRequestsFlag(false))
                  }}
                >
                  <a className="text-decoration-none nav-sidebar">
                    Friend Requests
                  </a>
                    <Puff
                      visible={hasRequests}
                      height="15"
                      width="15"
                      color="#e00"
                      ariaLabel="puff-loading"
                      wrapperStyle={{}}
                      wrapperClass="me-1"
                    />
                </div>
              </div>

              { searched ? (
                <ResultSearchPeople  />
              ) : !currentSection ? (
                <Friends
                  conn={conn}
                  messagesSection={messagesSectionRef}
                  peopleSection={peopleSectionRef}
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
