import Navbar from './Components/Navbar/Navbar';
import ParticlesComp from './Components/Particles/Particles';

import Login from './Components/Login/Login';
import { Routes, Route, useNavigate } from "react-router-dom"
import SignUp from './Components/SignUp/SignUp';
import Home from './Components/Home/Home';
import EmailVerification from './Components/EmailVerification/EmailVerification';
import { useEffect } from 'react';

function App() {
  const navigate=useNavigate()
  useEffect(_=>{
    const search=window.location.search.slice(1).split("=")
    if(search.length==2&&search[0]=="route")
      navigate("/"+search[1])
  },[])

  return (
    <>
     
      <Navbar/>
      
      <Routes>
     
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/verification"element={<EmailVerification/>}/>
        <Route path='*' element={<Home/>}/>
      </Routes>
      <ParticlesComp id="tsparitcles" />
    </>

  );
}

export default App;
