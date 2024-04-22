import Navbar from './Components/Navbar/Navbar';
import ParticlesComp from './Components/Particles/Particles';

import Login from './Components/Login/Login';
import { Routes, Route } from "react-router-dom"
import SignUp from './Components/SignUp/SignUp';
import Home from './Components/Home/Home';
import EmailVerification from './Components/EmailVerification/EmailVerification';

function App() {

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
