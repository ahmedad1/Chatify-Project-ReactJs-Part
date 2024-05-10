import { useEffect, useRef, useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Main from "../Main/Main";
import axios from "axios";
import checkAllCookies from "../../CookiesHandler/checkAllCookies";
import Swal from "sweetalert2";
import BACKEND_BASEURL from "../../backend-baseurl/backend-baseurl";
function Login() {
  const navigate = useNavigate();

  let [userName, setUserName] = useState("");
  let [password, setPassword] = useState("");
  let userNameInputRef = useRef();
  let passwordInputRef = useRef();
  let backendOrigin = BACKEND_BASEURL

  useEffect((_) => {
    if (checkAllCookies()) navigate("/");
    userNameInputRef.current.focus();
  }, []);
  async function loginBtnHandler(e) {
    e.preventDefault();
    document.querySelector(".fa-spinner").classList.remove("d-none");

    try {
      const result = await axios.post(
        `${backendOrigin}api/Account/login`,
        { userName: userName, password: password },
        { withCredentials: true }
      );
      document.querySelector(".fa-spinner").classList.add("d-none");

      if (result.data.success && result.data.emailConfirmed) navigate("/");
      else {
        localStorage.setItem("email", result.data.email);
        navigate("/verification");
      }
    } catch (e) {
      document.querySelector(".fa-spinner").classList.add("d-none");
      userNameInputRef.current.classList.add("is-invalid");
      passwordInputRef.current.classList.add("is-invalid");
      Swal.fire({ title: "Invalid username or password", icon: "error" });
    }
  }
  return (
    <Main>
      <form className="container p-lg-5 py-5 px-4 ">
        <h3 className="loginTitle text-info">Login</h3>
        <div className=" mt-5">
          <label className="form-label ">UserName</label>

          <input
            type="text"
            ref={userNameInputRef}
            className="form-control input-control"
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div className=" mt-5">
          <label className="form-label  ">Password</label>
          <input
            type="password"
            className="form-control input-control"
            onChange={(e) => setPassword(e.target.value)}
            required
            ref={passwordInputRef}
          />
          <Link to="/sign-up" className="input-text-login">
            dont have account?
          </Link>
        </div>
        <div className=" mt-5">
          <input
            type="checkbox"
            className="input-control form-check-input"
            onChange={(e) => {
              passwordInputRef.current.type = e.target.checked
                ? "text"
                : "password";
            }}
            id="showPasswordCheckbox"
          />
          <label htmlFor="showPasswordCheckbox" className="form-label ms-2">
            Show Password
          </label>
        </div>

        <button
          className=" btn btn-outline-info mt-5"
          onClick={(e) => loginBtnHandler(e)}
        >
          Login
          <i className="fa-solid fa-spinner fa-spin ms-2 d-none"></i>
        </button>
      </form>
    </Main>
  );
}
export default Login;
