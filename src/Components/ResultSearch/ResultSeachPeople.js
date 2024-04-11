import { useRef } from "react";

function ResultSeachPeople(props) {
  let requestSpan = useRef();
  function sendRequestHandler() {
    requestSpan.current.innerText =
      requestSpan.current.innerText === "+" ? "Sent ✔" : "+";
  }
  const peopleJsx = props.people?.map((p) => {
    return (
      <li
        key={p.id}
        className="person form-control mt-2 d-flex justify-content-between"
        onClick={sendRequestHandler}
      >
        <span>
          <i className="fa-regular fa-user"></i>{" "}
          <span className="ms-2">
            {p.firstName} {p.lastName} - @{p.userName}{" "}
          </span>
        </span>

        <span ref={requestSpan}>+</span>
      </li>
    );
  });
  return (
    <>
      <ul className="people d-flex flex-column list-unstyled mt-3">
        {peopleJsx}
      </ul>
    </>
  );
}
export default ResultSeachPeople;
