import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header/Header";
import Login from "./Components/Login/Login";

function App() {
  return (
    <Router>
      <div className="App">
        <Header/>
        <Routes>
          <Route path="/" element={<h1>Home</h1>}/>
          <Route path="/login" element={<Login/>}/>




        </Routes>
       
      </div>
    </Router>
  );
}

export default App;
