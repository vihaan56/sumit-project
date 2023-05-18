import Editor from "./components/Editor";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// import Dashboard from "./components/Dashboard";
import './styles/styles.css';
import SignIn from "./components/Login";
import Signup from "./components/Signup";
import HomePage from "./components/HomePage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<Signup />} />
        <Route exact path="/editor/:docid" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
