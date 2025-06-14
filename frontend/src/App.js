import './App.css';
import React, {useState} from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import NoteState from './context/notes/NoteState';
import Alert from './components/Alert';

function App() {
  const [alert, setAlert] = useState(null);

  const showalert=(message, type)=>{
    setAlert({
      msg: message,
      typ: type
    })
    setTimeout(() => {
      setAlert(null)
    }, 2000);
  }
  return (
    <>
    <NoteState>
    <BrowserRouter>
    <Alert alert={alert}/>
    <div className='container'>
    <Routes>
      <Route exact path="/home" element={<Home showalert={showalert}/>} />
      <Route exact path="/" element={<Login showalert={showalert}/>} />
      <Route exact path="/signup" element={<Signup showalert={showalert}/>} />
    </Routes>
    </div>
    </BrowserRouter>
    </NoteState>
    </>
  );
}

export default App;
