import "./App.css"; 
import NavBar from "./components/navBar";
import Home from "./pages/home";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Dogadjaji from "./pages/dogadjaji";

function App() {
   return ( 
        <BrowserRouter>
        <NavBar />
         <Routes>
          <Route path="/" element={<Home />} />       
          <Route path="/dogadjaji" element={<Dogadjaji />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/registracija" element={<Register />} />
        </Routes>
        </BrowserRouter> 


   ); 
  } 
  export default App;