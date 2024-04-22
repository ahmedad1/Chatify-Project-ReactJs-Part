import React, { useEffect } from "react";
import "./Navbar.css"
import { Link,useParams } from "react-router-dom";
import checkAllCookies from "../../CookiesHandler/checkAllCookies";
import { useLocation } from "react-router-dom";
import Cookies from "cookie-universal"
import { useDispatch } from "react-redux";
import { setCurrentChat } from "../../Redux-Toolkit/Slices/CurrentChatSlice";
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
                   
                </div>

            </div>
        </nav>

    )
}

export default Navbar;
