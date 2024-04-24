import { useEffect, useRef, useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Main from "../Main/Main";
import axios from "axios";

import { useSelector } from "react-redux";
import checkAllCookies from "../../CookiesHandler/checkAllCookies";
function Login() {
  const navigate = useNavigate();

  let [userName, setUserName] = useState("");
  let [password, setPassword] = useState("");
  let userNameInputRef = useRef();
  let passwordInputRef = useRef();
  let backendOrigin = useSelector((s) => s.backendOrigin);

  useEffect((_) => {
    if (checkAllCookies()) navigate("/");
    userNameInputRef.current.focus();
  }, []);
  async function loginBtnHandler(e) {
    e.preventDefault();
    const result = await axios.post(
      `${backendOrigin}login`,
      { userName: userName, password: password },
      { withCredentials: true }
    );
    if (result.status == 200) navigate("/");
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
            className="input-control"
            onChange={(e) => {
              passwordInputRef.current.type = e.target.checked
                ? "text"
                : "password";
            }}
            id="showPasswordCheckbox"
          />
          <label htmlFor="showPasswordCheckbox" className="form-label ms-2">Show Password</label>
        </div>

        <button
          className=" btn btn-outline-info mt-5"
          onClick={(e) => loginBtnHandler(e)}
        >
          Login
        </button>
      </form>
    </Main>
  );
}
export default Login;
