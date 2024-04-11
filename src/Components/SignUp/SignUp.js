
import { useEffect, useRef, useState } from "react"
import Main from "../Main/Main"
import "./SignUp.css"
function SignUp() {
    let [firstName,setFirstName] = useState("")
    let [lastName,setLastName] = useState("")
    let [email,setEmail] = useState("")
    let [userName, setUserName] = useState("")
    let [password, setPassword] = useState("")
    let firstNameInputRef=useRef()
    useEffect(_=>{
        console.log(firstNameInputRef.current);
        firstNameInputRef.current.focus()
    },[])
    return (
        <Main>
            <form className="container p-lg-5 p-4 ">
                <h3 className="text-info mb-5 ms-4 mt-2">Sign Up</h3>
                <div className="row">
                <div className="col-lg col-12 ps-lg-5 px-3 ms-lg-3">


                    <label className="form-label ">First Name</label>

                    <input type="text" className="form-control input-control " ref={firstNameInputRef} onChange={e=>setFirstName(e.target.value)} />

                </div>
                <div className=" col-lg col-12 pe-lg-5 px-3 me-3">

                    <label className="form-label ">Last Name</label>

                    <input type="text" className="form-control input-control " onChange={e=>setLastName(e.target.value)} />

                </div>
                </div>
                <div className=" mt-2 px-lg-5 px-1">

                    <label className="form-label ">Email</label>

                    <input type="email" className="form-control input-control" onChange={e=>setEmail(e.target.value)} />

                </div>
                <div className=" mt-2 px-lg-5 px-1">

                    <label className="form-label ">UserName</label>

                    <input type="text" className="form-control input-control" onChange={e=>setUserName(e.target.value)} />

                </div>
                <div className=" mt-2 px-lg-5 px-1">
                    <label className="form-label  ">Password</label>
                    <input type="password" className="form-control input-control"onChange={e=>setPassword(e.target.value)} />
                </div>
                <button className="form-conroll btn btn-outline-info mt-4 ms-lg-5">Sign Up</button>

            </form>
        </Main>
    )
}
export default SignUp