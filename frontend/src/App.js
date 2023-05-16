import Editor from "./components/Editor";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// import Dashboard from "./components/Dashboard";
import './styles.css';
import SignIn from "./components/Login";
import Signup from "./components/SIngup";
import HomePage from "./components/HomePage";
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<Signup />} />
        <Route exact path="/editor" element={<Editor />} />
        <Route exact path="/newroom/:id" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
