import { useDispatch } from "react-redux";
import { setCurrentChat } from "../../Redux-Toolkit/Slices/CurrentChatSlice";
function Friends(props) {
  const dispatch = useDispatch();
  let mediaQuery=matchMedia("(min-width:992px)")
  function showMessagesHandler(user) {
    if(!mediaQuery.matches){
      props.messagesSection.current.classList.remove("d-none")
      props.peopleSection.current.classList.add("d-none")
      
    }
    dispatch(
      setCurrentChat({
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
      })
    );
  }

  let friendsJSX = props.friends?.map((f) => {
    return (
      <li
        key={f.id}
        className="person form-control mt-2 d-flex justify-content-between"
        onClick={(_) => {
          showMessagesHandler(f);
        }}
      >
        <span className="text-center">
          <i className="fa-regular fa-user"></i>{" "}
          <small className="ms-2  ">
            <span>
              {f.firstName} {f.lastName}{" "}
            </span>
            -<small> @{f.userName}</small>
          </small>
        </span>
      </li>
    );
  });
  return (
    <ul className="people d-flex flex-column list-unstyled mt-3">
      {friendsJSX}
    </ul>
  );
}
export default Friends;
