import Navbar from './Components/Navbar/Navbar';
import ParticlesComp from './Components/Particles/Particles';

import Login from './Components/Login/Login';
import { Routes, Route } from "react-router-dom"
import SignUp from './Components/SignUp/SignUp';
import Home from './Components/Home/Home';

function App() {

  return (
    <>
      <Routes>
        <Route path='/users/:user' element={<Navbar.Authenticated />} />
        <Route path='*' element={<Navbar />} />
      </Routes>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path='/users/:user' element={<Home.Authenticated />} />
      </Routes>
      <ParticlesComp id="tsparitcles" />
    </>

  );
}

export default App;
