import React from "react";
import "./Navbar.css"
import { Link,useParams } from "react-router-dom";

function Navbar(props) {



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
const Authenticated=(props)=>{
    const params=useParams("user")
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">


                <Link to="/"className="navbar-brand text-info ">Chatify</Link>
                <a href="#navbarList" data-bs-toggle="collapse" className="navbar-toggler"><span className="navbar-toggler-icon"></span></a>
                <div className="collapse navbar-collapse " id="navbarList">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item"><Link to="/" className="nav-link active">Home</Link></li>
                        <li className="nav-item"><a className="nav-link">Contact Us</a></li>
                        <li className="nav-item"><a className="nav-link text-info"><i className="fa-regular fa-user"></i> {params.user}</a></li>

                    </ul>
                   
                </div>

            </div>
        </nav>

    )
}
Navbar.Authenticated=Authenticated
export default Navbar;
