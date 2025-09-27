import "./App.css"; 
import NavBar from "./navBar";
import Home from "./home";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import Login from "./login";
import Register from "./register";
import Dogadjaji from "./dogadjaji";

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