import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from './MyContext.jsx';
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";
import { AuthContext } from "./AuthContext.jsx";


// react-markdown and rehype highting are used for gpt reply
function ChatWindow() {
  const { prompt, setPrompt, reply, setReply, currThreadId, prevChats, setPrevChats, newChats, setNewChats } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { logout } = useContext(AuthContext);

  const getReply = async () => {
    setLoading(true);
    setNewChats(false);
    console.log("message ", prompt, " threadId ", currThreadId);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId
      })
    };

    try {
      const response = await fetch("http://localhost:8080/api/chat", options);
      const res = await response.json();
      console.log(res);
      setReply(res.reply);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }

  // append the current chat to prevChat array when threadId changes
  useEffect(() => {
    if (prompt && reply) {
      setPrevChats(prevChats => (
        [...prevChats, {
          role: "user",
          content: prompt
        }, {
          role: "assistant",
          content: reply
        }]
      ))
    }
    setPrompt("");
  }, [reply]);

  return (
    <div className="chatWindow">

      <div className="navbar">
        <span> SigmaGPT <i className="fa-solid fa-angle-down"></i></span>
        <div className="userIconDiv" onClick={() => setIsOpen(!isOpen)}>
          <span className="userIcon"><i className="fa-solid fa-user"></i></span>
        </div>
      </div>
      {
       
        isOpen &&
        <div className="dropDown">
          <div className="dropDownItem"><i className="fa-solid fa-gear"></i> Settings</div>
          <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
          <div className="dropDownItem" onClick={logout}><i className="fa-solid fa-arrow-right-from-bracket"></i> Log out</div>
        </div>
      }
      <Chat> </Chat>

      <ScaleLoader color="#fff" loading={loading} >

      </ScaleLoader>

      <div className="chatInput">
        <div className="inputBox">
          <input type="text" placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" ? getReply() : ''} />
          <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
        </div>
        <div >
          <p className="info"> SigmaGPT can make mistakes. Check important info. See Cookie Preferences.</p>
        </div>
      </div>

    </div>
  );
}

export default ChatWindow;