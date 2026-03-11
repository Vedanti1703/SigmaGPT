import './App.css';
import Sidebar from "./Sidebar.jsx";
import ChatWindow from './ChatWindow.jsx';
import {MyContext} from "./MyContext.jsx";
import { useState,useContext } from 'react';
import { v1 as uuidv1 } from 'uuid';
import { AuthContext } from "./AuthContext.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";

function App() {
    const { user } = useContext(AuthContext);
    const [authPage, setAuthPage] = useState("login");
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChats, setNewChats] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

 const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    prevChats, setPrevChats,
    newChats, setNewChats,
    allThreads, setAllThreads
 };

 if (!user) {
  return authPage === "login" 
    ? <Login goToRegister={() => setAuthPage("register")} />
    : <Register goToLogin={() => setAuthPage("login")} />;
}

  return (
    <div className="app">
      <MyContext.Provider value={providerValues}>
      <Sidebar />
      <ChatWindow /> 
      </MyContext.Provider>
    </div>
  )
}

export default App
