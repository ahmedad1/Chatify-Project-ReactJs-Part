import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsTypingFlag } from "../../Redux-Toolkit/Slices/CurrentChatSlice";
function MessagesHead(props) {
  const currentChat = useSelector((x) => x.currentChat);
  let currentChatRef=useRef(currentChat)
  const dispatch=useDispatch()
  let mediaQuery = matchMedia("(min-width:992px)");
  useEffect(_=>{
    currentChatRef.current=currentChat
  
  })
 useEffect(_=>{
  if(!mediaQuery.matches&&Object.keys(currentChat).length==0){
   
    props.messagesSection.current.classList.add("d-none")
    props.peopleSection.current.classList.remove("d-none")
 }
 props.conn?.on("isTyping",(userName)=>{
  let timeOut
      if(currentChatRef.current.userName==userName){
        if(currentChatRef.current.isTyping){return}
        dispatch(setIsTypingFlag(true))
        timeOut=setTimeout(_=>{
          dispatch(setIsTypingFlag(false))
        },1000)
      }
   return function(){
    if(timeOut)
      clearTimeout(timeOut)
   }   
 })
 },[currentChat])
 
  return (
    <>
      {currentChat.userName ? (
        <h3
          className={`text-info ${
            mediaQuery.matches ? "text-left" : "text-center"
          } bg-glass p-3 rounded px-4`}
        >
          Messages:{" "}
          {`${currentChat.firstName} ${currentChat.lastName} - @${currentChat.userName}`}{" "}
          {currentChat.isTyping ? (
            <span className="text-info ">is typing....</span> /*redux context */
          ) : null}
        </h3>
      ) : (
        <h3 className="text-info bg-glass p-3 rounded px-4">Messages</h3>
      )}
    </>
  );
}
export default MessagesHead;
