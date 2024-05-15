import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddMessages } from "../../Redux-Toolkit/Slices/MessagesSlice";
import sendRequestAuth from "../../HelperSharedMethods/SendRequestAuth";
import BACKEND_BASEURL from "../../backend-baseurl/backend-baseurl";
import Swal from "sweetalert2";
import AlertSessionEnded from "../../HelperSharedMethods/AlertSessionEnded";
import { useNavigate } from "react-router-dom";
import { signOut } from "../../Redux-Toolkit/Slices/SignOutSlice";
import Cookies from "cookie-universal";
function Messages(props) {
  let currentChat = useSelector((x) => x.currentChat);
  let messages = useSelector((x) => x.messages);
  const cookies = Cookies();
  let messageTextRef = useRef();
  let messagesTextsParentRef = useRef();
  const navigate = useNavigate();
  let dispatch = useDispatch();
  useEffect(
    (_) => {
      if (!currentChat.groupId) return;
      sessionStorage.setItem("messagesPage", 1);
      sendRequestAuth(
        `${BACKEND_BASEURL}api/Chat/group/${currentChat.groupId}/messages/page/1`
      ).then((res) => {
        if (!res) {
          AlertSessionEnded(navigate, dispatch, signOut);
          return;
        } else if (res.status !== 200) {
          Swal.fire({ title: "Something Went Wrong", icon: "error" });
          return;
        } else {
          dispatch(AddMessages(res.data));
        }
      });
    },
    [currentChat.groupId]
  );
  useEffect((_) => {
    messagesTextsParentRef.current?.scrollTo(
      0,
      messagesTextsParentRef.current.scrollHeight
    );
  });
  // if (!messages.some(x=>x.userName==currentChat.userName)){
  // return<></>
  // }
  function handleSendMessage() {
    if (!messageTextRef.current?.value.length) return;
    props.conn?.invoke(
      "SendMessage",
      messageTextRef.current.value,
      currentChat.groupId
    );
    //userName represents the sender's userName here:
    dispatch(
      AddMessages([
        {
          message: messageTextRef.current.value,
          userName: cookies.get("userName"),
          groupId: currentChat.groupId,
        },
      ])
    );
  }
  let messagesJSX = messages.map((m) => {
    return (
      <li key={m.id} className="mt-1">
        <span className="text-info ">
          {m.userName == cookies.get("userName")
            ? "You"
            : currentChat.firstName}{" "}
          :
        </span>{" "}
        <span style={{overflowWrap:"break-word"}}>{m.message}</span>
      </li>
    );
  });

  return (
    <div
      style={{ overflowY: "auto" }}
      className="messagesContent bg-glass p-5 mt-3 rounded d-flex flex-column justify-content-end  "
    >
      <div
        ref={messagesTextsParentRef}
        className="messages-texts text-light mb-3"
        style={{ overflow: "auto" }}
      >
        <ul className="list-unstyled">{messagesJSX}</ul>
      </div>
      <div className="d-flex justify-content-between flex-row-reverse">
        <input
          type="text"
          className="form-control message-text "
          placeholder="type a message"
          ref={messageTextRef}
        />
        <input
          onClick={async (e) => {
            handleSendMessage();
          }}
          type="submit"
          className="btn btn-outline-info me-2"
          value={"Send"}
        />
      </div>
    </div>
  );
}
export default Messages;
