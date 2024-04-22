import { useEffect } from "react";
import { useSelector } from "react-redux";
function MessagesHead(props) {
  const selector = useSelector((x) => x.currentChat);
  let mediaQuery = matchMedia("(min-width:992px)");
 useEffect(_=>{
  if(!mediaQuery.matches&&Object.keys(selector).length==0){
   
    props.messagesSection.current.classList.add("d-none")
    props.peopleSection.current.classList.remove("d-none")

 
 }
 },[selector])
 
  return (
    <>
      {selector.userName ? (
        <h3
          className={`text-info ${
            mediaQuery.matches ? "text-left" : "text-center"
          } bg-glass p-3 rounded px-4`}
        >
          Messages:{" "}
          {`${selector.firstName} ${selector.lastName} - @${selector.userName}`}{" "}
          {selector.isTyping ? (
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
