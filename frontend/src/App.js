import "./css/App.css"; 
import "./css/navBar_footer.css"
import "./css/animacija.css"
import "./css/forme.css";
import NavBar from "./components/navBar";
import Home from "./pages/home";
import { BrowserRouter,Routes,Route, Navigate, Outlet } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Dogadjaji from "./pages/dogadjaji";
import ChangePassword from "./pages/promenaLozinke"
import Footer from "./components/footer";
import ResetPassword from "./pages/resetPassword";
import Omiljeni from "./pages/omiljeni";


const PrivateRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};


function App() {
   return ( 
     <div>
        <BrowserRouter>
        <NavBar />
         <Routes>
            <Route path="/" element={<Home />} />       
            <Route path="/dogadjaji" element={<Dogadjaji />} /> 
            <Route path="/login" element={<Login />} />
            <Route path="/registracija" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} /> 
          <Route element={<PrivateRoute />}>
            <Route path="/promenaLozinke" element={<ChangePassword />} />
            <Route path="/omiljeni" element={<Omiljeni />} />
          </Route>
        </Routes>
        </BrowserRouter> 
        <Footer />
        </div>
   ); 
  } 
  export default App;