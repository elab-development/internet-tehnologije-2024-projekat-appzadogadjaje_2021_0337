import "./css/App.css"; 
import "./css/navBar_footer.css"
import "./css/animacija.css"
import "./css/forme.css";
import NavBar from "./components/navBar";
import Home from "./pages/home";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Dogadjaji from "./pages/dogadjaji";
import ChangePassword from "./pages/promenaLozinke"
import Footer from "./components/footer";
import ResetPassword from "./pages/resetPassword";
import Omiljeni from "./pages/omiljeni";


function App() {
   return ( 
     <div>
        <BrowserRouter>
        <NavBar />
         <Routes>
          <Route path="/" element={<Home />} />       
          <Route path="/dogadjaji" element={<Dogadjaji />} /> 
          <Route path="/login" element={<Login />} />
           <Route path="/reset-password" element={<ResetPassword />} /> 
          <Route path="/registracija" element={<Register />} />
          <Route path="/promenaLozinke" element={<ChangePassword />} />
          <Route path="/omiljeni" element={<Omiljeni />} />
        </Routes>
        </BrowserRouter> 
        <Footer />
        </div>
   ); 
  } 
  export default App;