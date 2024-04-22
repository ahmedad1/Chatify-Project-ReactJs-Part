import { useEffect, useState } from "react";
import checkAllCookies from "../../CookiesHandler/checkAllCookies";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import "./EmailVerification.css";
function EmailVerification(props) {
  const navigate = useNavigate();
  useEffect((_) => {
    if (checkAllCookies() /*|| !localStorage.getItem("email")*/) navigate("/");
    inputCodeRef.current.focus();
  }, []);
  let inputCodeRef = useRef();
  let [code, setCode] = useState(0);
  function onKeyDownHandler(e) {
    if (
      !/[0-9]+/gi.test(e.key) &&
      (e.key != "v" || e.key != "V") &&
      !e.ctrlKey &&
      e.key != "Backspace" &&
      e.key != "Enter"
    ) {
      e.preventDefault();
      return;
    }
    setCode(e.target.value);
  }
  function onPasteHandler(e) {
    if (isNaN((e.clipboardData || window.clipboardData).getData("text"))) {
      e.preventDefault();
      return;
    }
    setCode(e.target.value);
  }
  return (
    <div className="container p-5">
      <h4 className="text-info">An email has been sent to you with a code</h4>
      <form className="form-control bg-glass mt-5 p-5">
        <div className="mb-3">
          <label className="form-label">Enter the code</label>
          <input
            ref={inputCodeRef}
            onKeyDown={(e) => {
              onKeyDownHandler(e);
            }}
            onPaste={(e) => {
              onPasteHandler(e);
            }}
            className="form-control bg-glass rm-border input-text"
            type="text"
          />
        </div>
        <input
          type="submit"
          className="form-control btn btn-outline-info mt-3"
        />
      </form>
    </div>
  );
}
export default EmailVerification;
