function Messages(props) {
  let messagesJSX = props.messages?.map((m) => {
    return (
      <li key={m.id} className="mt-1">
        <span className="text-info ">{m.sender} :</span>{" "}
        <span>{m.content}</span>
      </li>
    );
  });

  return (
    <div
      style={{ overflowY: "auto" }}
      className="messagesContent bg-glass p-5 mt-3 rounded d-flex flex-column justify-content-end  "
    >
      <div className="messages-texts text-light mb-3">
        <ul className="list-unstyled">{messagesJSX}</ul>
      </div>
      <div className="d-flex justify-content-between flex-row-reverse">
        <input
          type="text"
          className="form-control message-text "
          placeholder="type a message"
        />
        <input
          type="submit"
          className="btn btn-outline-info me-2"
          value={"Send"}
        />
      </div>
    </div>
  );
}
export default Messages;
