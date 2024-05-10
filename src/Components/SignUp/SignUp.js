import { useEffect, useRef, useState } from "react";
import Main from "../Main/Main";
import "./SignUp.css";
import checkAllCookies from "../../CookiesHandler/checkAllCookies";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import BACKEND_BASEURL from "../../backend-baseurl/backend-baseurl";
function SignUp() {
  const navigate = useNavigate();
  let userNameInputRef = useRef();
  let emailInputRef = useRef();
  let passwordInputRef = useRef();
  let [firstName, setFirstName] = useState("");
  let [lastName, setLastName] = useState("");
  let [email, setEmail] = useState("");
  let [userName, setUserName] = useState("");
  let [password, setPassword] = useState("");
  let firstNameInputRef = useRef();
  const backendUrl = BACKEND_BASEURL
  useEffect((_) => {
    if (checkAllCookies()) navigate("/");

    firstNameInputRef.current.focus();
  }, []);
  async function submitionHandler(e) {
    e.preventDefault();
    let result;
    document.querySelector(".fa-spinner").classList.remove("d-none");
    try {
      result = await axios.post(`${backendUrl}api/Account/sign-up`, {
        firstName: firstName,
        lastName: lastName,
        email: email,
        userName: userName,
        password: password,
      });
      localStorage.setItem("email", email);
      navigate("/verification");
    } catch (e) {
      document.querySelector(".fa-spinner").classList.add("d-none");
      if (e.response.data.hasRepeatedEmail) {
        emailInputRef.current.classList.add("is-invalid");
        emailInputRef.current.focus();
        userNameInputRef.current.classList.remove("is-invalid");
      } else if (e.response.data.hasRepeatedUserName) {
        userNameInputRef.current.classList.add("is-invalid");
        userNameInputRef.current.focus();
        emailInputRef.current.classList.remove("is-invalid");
      }
      else{
        if(e.response.data?.errors)
        for(let i in e.response.data.errors){
        Swal.fire({title:e.response.data.errors[i][0]})
        break;
        }
      }
    }
  }
  return (
    <Main>
      <form
        className="container p-lg-5 p-4 "
        onSubmit={async (e) => {
          await submitionHandler(e);
        }}
      >
        <h3 className="text-info mb-5 ms-4 mt-2">Sign Up</h3>
        <div className="row">
          <div className="col-lg col-12 ps-lg-5 px-1 ms-lg-3">
            <label className="form-label ">First Name</label>

            <input
              type="text"
              className="form-control input-control "
              ref={firstNameInputRef}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className=" col-lg col-12 pe-lg-5 px-1 me-3">
            <label className="form-label ">Last Name</label>

            <input
              type="text"
              className="form-control input-control "
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>
        <div className=" mt-2 px-lg-5 px-1">
          <label className="form-label ">Email</label>

          <input
            type="email"
            className="form-control input-control"
            onChange={(e) => setEmail(e.target.value)}
            ref={emailInputRef}
            required
          />
          <div className="invalid-feedback">
            This email is already registered
          </div>
        </div>
        <div className=" mt-2 px-lg-5 px-1">
          <label className="form-label ">UserName</label>

          <input
            type="text"
            className="form-control input-control"
            onChange={(e) => setUserName(e.target.value)}
            ref={userNameInputRef}
            required
          />
          <div className="invalid-feedback">
            This username is already registered
          </div>
        </div>
        <div className=" mt-2 px-lg-5 px-1">
          <label className="form-label  ">Password</label>
          <input
            type="password"
            className="form-control input-control"
            onChange={(e) => setPassword(e.target.value)}
            required
            ref={passwordInputRef}
            minLength={8}
            maxLength={100}
          />
        </div>
        <div className=" mt-2 px-lg-5 px-1">
          <input
            type="checkbox"
            className="input-control form-check-input"
            onChange={(e) => {
              passwordInputRef.current.type = e.target.checked
                ? "text"
                : "password";
            }}
            id="showPasswordInp"
          />
          <label htmlFor="showPasswordInp" className="form-label ms-2 ">
            Show password
          </label>
        </div>
        <button type="submit" className=" btn btn-outline-info mt-4 ms-lg-5">
          Sign Up
          <i className="fa-solid fa-spinner fa-spin ms-2 d-none"></i>
        </button>
      </form>
    </Main>
  );
}
export default SignUp;
