import { useEffect, useState } from "react";
import checkAllCookies from "../../CookiesHandler/checkAllCookies";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import "./EmailVerification.css";
import axios from "axios";
import Swal from "sweetalert2";

import BACKEND_BASEURL from "../../backend-baseurl/backend-baseurl";
function EmailVerification(props) {
  const navigate = useNavigate();
  const backendUrl = BACKEND_BASEURL;
  useEffect((_) => {
    (async function () {
      if (checkAllCookies() || !localStorage.getItem("email")) navigate("/");
      inputCodeRef.current.focus();
      try {
        await axios.post(
          `${backendUrl}api/Account/code/send`,
          {
            email: localStorage.getItem("email"),
          }
          //, { withCredentials: true }
        );
      } catch (e) {
        Swal.fire(
          "Failed to send the code or your email hasn't been registered yet"
        ).then((res) => {
          if (res.isConfirmed || res.isDismissed) navigate("/");
        });
      }
    })();
  }, []);
  let inputCodeRef = useRef();

  function onKeyDownHandler(e) {
    if (
      !/[0-9]+/gi.test(e.key) &&
      (e.key !== "v" || e.key !== "V") &&
      !e.ctrlKey &&
      e.key !== "Backspace" &&
      e.key !== "Enter"
    ) {
      e.preventDefault();
      return;
    }
  }
  async function onPasteHandler(e) {
    if (
      isNaN(await (e.clipboardData || window.clipboardData).getData("text"))
    ) {
      e.preventDefault();
      return;
    }
  }

  async function submitionHandler(e) {
    e.preventDefault();
    if (isNaN(inputCodeRef.current.value)) {
      return;
    }
    try {
      await axios.post(
        `${backendUrl}api/Account/code/verify`,
        {
          email: localStorage.getItem("email"),
          code: inputCodeRef.current.value,
        }
        //, { withCredentials: true }
      );
      Swal.fire({ title: "Confirmed Successfully", icon: "success" }).then(
        (res) => {
          if (res.isConfirmed || res.isDismissed) {
            localStorage.removeItem("email");
            navigate("/login");
          }
        }
      );
    } catch {
      inputCodeRef.current.classList.add("is-invalid");
    }
  }
  return (
    <div className="container p-5">
      <h4 className="text-info">An email has been sent to you with a code</h4>
      <form
        className="form-control bg-glass mt-5 p-5"
        onSubmit={async (e) => {
          await submitionHandler(e);
        }}
      >
        <div className="mb-3">
          <label className="form-label">Enter the code</label>
          <input
            ref={inputCodeRef}
            onKeyDown={(e) => {
              onKeyDownHandler(e);
            }}
            onPaste={async (e) => {
              await onPasteHandler(e);
            }}
            className="form-control bg-glass rm-border input-text "
            type="text"
          />
          <div className="invalid-feedback">Code is incorrect</div>
        </div>
        <input
          type="submit"
          className="form-control btn btn-outline-info mt-3"
          required
        />
      </form>
    </div>
  );
}
export default EmailVerification;
