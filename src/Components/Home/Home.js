import { Link } from "react-router-dom";
import "./Home.css";
import Main from "../Main/Main";
import "./Home.Authenticated.css";
import ResultSeachPeople from "../ResultSearch/ResultSeachPeople";
import Messages from "../Messages/Messages";
import MessagesHead from "../Messages/MessagesHead";
import Friends from "../Friends/Friends";
import { useRef } from "react";
import Cookies from "cookie-universal"
import checkAllCookies from "../../CookiesHandler/checkAllCookies";
function Home(props) {
  const cookies= Cookies();
 
  return (
    <>
     {checkAllCookies()?<HomeAutenticated/>:<HomeNotAuthenticated/>}
    </>
  );
}

var HomeNotAuthenticated=(props)=>{
  return (
    <>
      <Main>
        <h2 className="text-info text-center">
          Chatify for messages & video calls
        </h2>
        <p className=" mt-4 subTitle text-center">
          Chat with your family, friends and anyone, You can also share your own
          PC screen if you want to your peer
        </p>
        <Link to="/sign-up" className="btn btn-outline-warning mt-4">
          {" "}
          Join us
        </Link>
      </Main>
    </>
  );
}

var HomeAutenticated =(props)=>  {
 const messagesSectionRef=useRef();
 const peopleSectionRef=useRef();
  
  return (
    <>
      <div className="Auth px-lg-5 mt-lg-0 mt-5">
        <div className=" row m-lg-auto pt-lg-5 px-lg-5">
          <div className="col-lg-9 d-lg-block d-none"ref={messagesSectionRef}>
            {/* <MessagesHead dest={"Mohamed"} isTyping={true}/> */}
            <MessagesHead messagesSection={messagesSectionRef} peopleSection={peopleSectionRef}/>
            <Messages messages={[{ id: 1, sender: "You", content: "hi" }]} />
          </div>
          <div className="col-lg-3 col-12"ref={peopleSectionRef}>
            <h3 className="text-info bg-glass p-3 rounded px-4">People </h3>
            <div className="peopleSection bg-glass p-4 mt-3 rounded d-flex flex-column  ">
              <input
                type="text"
                className="form-control search "
                placeholder="Seach for people"
              />
              {/* <ResultSeachPeople
                people={[{ id: 1, firstName: "Ahmed", lastName: "Omar" }]}
              /> */}
              <Friends messagesSection={messagesSectionRef} peopleSection={peopleSectionRef}
                friends={[
                  {
                    id: 1,
                    firstName: "Ahmed",
                    lastName: "Omar",
                    userName: "ahmedad0",
                  },
                  {
                    id: 2,
                    firstName: "Mohamed",
                    lastName: "Omar",
                    userName: "mohamedmd0",
                  }
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );

};

export default Home;
