import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AddMessages,
  AddRealTimeMessages,
} from "../../Redux-Toolkit/Slices/MessagesSlice";
import sendRequestAuth from "../../HelperSharedMethods/SendRequestAuth";
import BACKEND_BASEURL from "../../backend-baseurl/backend-baseurl";
import Swal from "sweetalert2";
import AlertSessionEnded from "../../HelperSharedMethods/AlertSessionEnded";
import { useNavigate } from "react-router-dom";
import { signOut } from "../../Redux-Toolkit/Slices/SignOutSlice";
import Cookies from "cookie-universal";
import tryActiveTokens from "../../HelperSharedMethods/tryActiveTokens";
import TryToReconnectToSignalR from "../../HelperSharedMethods/TryReconnectingToSignalR";
function Messages(props) {
  let currentChat = useSelector((x) => x.currentChat);
  let messages = useSelector((x) => x.messages);
  let currentScrollTop = useRef(0);
  const cookies = Cookies();
  let messageTextRef = useRef();
  let messagesTextsParentRef = useRef();
  const [isTyping, setIsTyping] = useState(false); // for the current user who Authenticated
  const navigate = useNavigate();
  let dispatch = useDispatch();
  async function getPagedMessages(pageNum) {
    sendRequestAuth(
      `${BACKEND_BASEURL}api/Chat/group/${currentChat.groupId}/messages/page/${pageNum}`
    ).then((res) => {
      if (!res) {
        AlertSessionEnded(navigate, dispatch, signOut);
        return;
      } else if (res.status !== 200) {
        Swal.fire({ title: "Something Went Wrong", icon: "error" });
        return;
      } else {
        if (res.data.length !== 0) {
          sessionStorage.setItem(
            "messagesPage",
            +sessionStorage.getItem("messagesPage") + 1
          );
          dispatch(AddMessages(res.data));
        }
      }
    });
  }
  useEffect(
    (_) => {
      if (!currentChat.groupId) return;
      sessionStorage.setItem("messagesPage", 1);
      getPagedMessages(1);
    },
    [currentChat.groupId]
  );
  useLayoutEffect((_) => {
    if (+sessionStorage.getItem("messagesPage") === 2) {
      messagesTextsParentRef.current?.scrollTo(
        0,
        messagesTextsParentRef.current.scrollHeight
      );
    } else {
      messagesTextsParentRef.current?.scrollTo(
        0,
        messagesTextsParentRef.current.scrollHeight - currentScrollTop.current
      );
    }
  });
  // if (!messages.some(x=>x.userName==currentChat.userName)){
  // return<></>
  // }
  async function handleSendMessage() {
    if (!messageTextRef.current?.value.length) return;
    if (sessionStorage.getItem("connection") == "false") return;
    if (props.conn&&props.conn.state != "Connected") {
     
      if(await TryToReconnectToSignalR(props.conn)===false){
        navigate("/");
        dispatch(signOut());
        return
      }
      
    }
    if (messageTextRef.current?.value.length > 2000) {
      Swal.fire({
        title: "Message's length should be between 1 and 2000 characters",
        icon: "error",
      });
      return;
    }
    if (!currentChat.groupId) return;

    props.conn
      ?.invoke("SendMessage", messageTextRef.current.value, currentChat.groupId)
      .catch((rej) =>
        props.conn.start().then((res) => {
          handleSendMessage();
        })
      );

    //userName represents the sender's userName here:
    dispatch(
      AddRealTimeMessages([
        {
          id:
            messages.length === 0
              ? 1
              : +messages.reduce((max, message) => {
                  return max.id > message.id ? max.id : message.id;
                }) + 1,
          message: messageTextRef.current.value,
          userName: cookies.get("userName"),
          groupId: currentChat.groupId,
          isRead: true,
        },
      ])
    );
    messageTextRef.current.value = "";
    if (isTyping) setIsTyping(false);
  }
  let messagesJSX = messages.map((m) => {
    return (
      <li key={m.id} className="mt-1 d-flex" style={{ gap: "5px" }}>
        <span className="text-info ">
          {m.userName == cookies.get("userName") ? "You" : currentChat.userName}{" "}
          :
        </span>{" "}
        <span style={{ overflowWrap: "break-word" }}>{m.message}</span>
      </li>
    );
  });
  async function handleAlertTyping() {
    if (!currentChat.groupId) return;
    if (isTyping == true) return;
    if (sessionStorage.getItem("connection") == "false") return;
      if (props.conn&&props.conn.state != "Connected") {
       
        if(await TryToReconnectToSignalR(props.conn)===false){
          navigate("/");
          dispatch(signOut());
          return
        }
        
      }
    props.conn?.invoke("TypingAlert", currentChat.groupId);
    setIsTyping(true);
    let timeOut = setTimeout((_) => {
      setIsTyping(false);
    }, 1000);
  }
  function handleScrollPagination(e) {
    if (e.target.scrollTop !== 0 || +sessionStorage.getItem("messagesPage") < 2)
      return;
    let messagesPage = sessionStorage.getItem("messagesPage");
    if (!messagesPage || isNaN(messagesPage)) {
      sessionStorage.setItem("messagesPage", 1);
      messagesPage = 1;
    }

    currentScrollTop.current = e.target.scrollHeight;

    getPagedMessages(+messagesPage);
  }
  return (
    <div
      style={{ overflowY: "auto" }}
      className="messagesContent bg-glass p-5 mt-3 rounded d-flex flex-column justify-content-end  "
    >
      <div
        ref={messagesTextsParentRef}
        className="messages-texts text-light mb-3"
        style={{ overflow: "auto" }}
        onScroll={(e) => {
          handleScrollPagination(e);
        }}
      >
        <ul className="list-unstyled">{messagesJSX}</ul>
      </div>
      <div className="d-flex justify-content-between flex-row-reverse">
        <input
          type="text"
          className="form-control message-text "
          placeholder="type a message"
          ref={messageTextRef}
          onChange={(e) => {
            handleAlertTyping(e);
          }}
          onKeyDown={(e) => {
            if (e.key == "Enter") handleSendMessage();
          }}
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
