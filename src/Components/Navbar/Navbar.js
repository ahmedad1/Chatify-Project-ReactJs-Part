import React, { useEffect } from "react";
import "./Navbar.css"
import { Link,useNavigate } from "react-router-dom";
import checkAllCookies from "../../CookiesHandler/checkAllCookies";
import { useLocation } from "react-router-dom";
import Cookies from "cookie-universal"
import { useDispatch } from "react-redux";
import { clearCurrentChat, setCurrentChat } from "../../Redux-Toolkit/Slices/CurrentChatSlice";
import axios from "axios";
import Swal from "sweetalert2";
import { signOut } from "../../Redux-Toolkit/Slices/SignOutSlice";

import BACKEND_BASEURL from "../../backend-baseurl/backend-baseurl";
import tryActiveTokens from "../../HelperSharedMethods/tryActiveTokens";
import { clearRequests } from "../../Redux-Toolkit/Slices/RequestsSlice";
import { clearOnlineFriends } from "../../Redux-Toolkit/Slices/OnlineFriendsSlice";
import { clearHasFriendRequests } from "../../Redux-Toolkit/Slices/HasFriendRequestsSlice";
import { clearFriends } from "../../Redux-Toolkit/Slices/FriendsSlice";
import { ClearMessages } from "../../Redux-Toolkit/Slices/MessagesSlice";
function Navbar(props) {
const location=useLocation()
useEffect(_=>{},[location.pathname=="/"])
return <>
{checkAllCookies()?<Authenticated/>:<NotAuthenticated/>}

</>

  
}
var NotAuthenticated=(props)=>{
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">


                <Link to="/"className="navbar-brand text-info ">Chatify</Link>
                <a href="#navbarList" data-bs-toggle="collapse" className="navbar-toggler"><span className="navbar-toggler-icon"></span></a>
                <div className="collapse navbar-collapse " id="navbarList">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item"><Link to="/" className="nav-link active">Home</Link></li>
                        <li className="nav-item"><a className="nav-link">Contact Us</a></li>
                    </ul>
                    <Link to="/login"  className="btn btn-outline-info ms-lg-2 mt-lg-0 mt-2 ">Login</Link>
                </div>

            </div>
        </nav>

    )
}
var Authenticated=(props)=>{
   const cookies=Cookies()
   const dispatch=useDispatch()
   const backendUrl=BACKEND_BASEURL
   const navigate=useNavigate()
   async function signOutHandler(){
    document.querySelector(".fa-spinner").classList.remove("d-none")
    try{
        await axios.delete(`${backendUrl}api/Account/sign-out`,{withCredentials:true})
        navigate("/")
        dispatch(signOut())
        dispatch(clearRequests());
        dispatch(clearOnlineFriends());
        dispatch(clearHasFriendRequests());
        dispatch(clearFriends());
        dispatch(clearCurrentChat());
        dispatch(ClearMessages())

    }
    catch(e){
        if(e.response.status==401){
            const result=await tryActiveTokens();
            if(!result){
                cookies.removeAll()
                navigate("/")
                dispatch(signOut())
                return ;
            }
            await signOutHandler()
            
        }else{
        document.querySelector(".fa-spinner").classList.add("d-none")

        Swal.fire("Something went wrong ... try again")
        }
    }
    
   }
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">


                <Link onClick={_=>{dispatch(setCurrentChat({}))}} to="/"className="navbar-brand text-info ">Chatify</Link>
                <a href="#navbarList" data-bs-toggle="collapse" className="navbar-toggler"><span className="navbar-toggler-icon"></span></a>
                <div className="collapse navbar-collapse " id="navbarList">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item"><Link onClick={_=>{dispatch(setCurrentChat({}))}} to="/" className="nav-link active">Home</Link></li>
                        <li className="nav-item"><a className="nav-link">Contact Us</a></li>
                        <li className="nav-item"><a className="nav-link text-info"><i className="fa-regular fa-user"></i> {cookies.get("firstName")}</a></li>

                    </ul>
                   <button className="btn btn-outline-info"onClick={signOutHandler}>Sign Out<i className="fa-solid fa-spinner fa-spin ms-2 d-none" ></i></button>
                </div>

            </div>
        </nav>

    )
}

export default Navbar;
