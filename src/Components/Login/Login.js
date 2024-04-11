
import { useEffect, useRef, useState } from "react"
import "./Login.css"
import { Link } from "react-router-dom"
import {useNavigate} from "react-router-dom"
import Main from "../Main/Main"
function Login() {
    let [userName, setUserName] = useState("")
    let [password, setPassword] = useState("")
    let userNameInputRef=useRef()

    useEffect(_=>{
        userNameInputRef.current.focus()
    },[])
    const navigate=useNavigate()
    return (
        <Main>
            <form className="container p-lg-5 py-5 px-4 ">
                <h3 className="loginTitle text-info">Login</h3>
                <div className=" mt-5">

                    <label className="form-label ">UserName</label>

                    <input type="text"ref={userNameInputRef} className="form-control input-control" onChange={e=>setUserName(e.target.value)} />

                </div>
                <div className=" mt-5">
                    <label className="form-label  ">Password</label>
                    <input type="password" className="form-control input-control"onChange={e=>setPassword(e.target.value)} />
                    <Link to="/sign-up"className="input-text">dont have account?</Link>
                </div>
                <button className=" btn btn-outline-info mt-5"onClick={e=>{navigate("/users/Ahmed")}}>Login</button>

            </form>
        </Main>
    )
}
export default Login