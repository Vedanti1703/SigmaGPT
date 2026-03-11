import "./Sidebar.css";
import {  useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from 'uuid';
import { AuthContext } from "./AuthContext";

function Sidebar() {
     const { user } = useContext(AuthContext);
         const {allThreads, setAllThreads, currThreadId, setNewChats, setPrompt, setReply, setCurrThreadId, setPrevChats} = useContext(MyContext);

        const getAllThreads = async () => {
            try{
                const response = await fetch("http://localhost:8080/api/thread");
                const res = await response.json();
                const filterdData=res.map((thread) => ({threadId: thread.threadId,title: thread.title}));
                console.log("Threads fetched: ", filterdData);
                setAllThreads(filterdData);
            }catch(err){
                console.log("Error fetching threads: ", err);
            }
        };

        useEffect(() => {
                getAllThreads();
        }, [currThreadId])

       const createNewChat = () => {
        setNewChats(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    }

        const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
            const res = await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChats(false);
            setReply(null);
        } catch(err) {
            console.log(err);
        }
    }   
    
   const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, {
                method: "DELETE"
            });
            const res = await response.json();
            console.log(res);

            //re render updated threads list
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if (threadId === currThreadId) {
                createNewChat();
            }
        }
        catch(err) {
            console.log(err);
        }
   }

    return (  
        //new chat  
        <section className="sidebar">
            <button onClick={createNewChat}>
                <img src="src/assets/blacklogo.png" alt="gpt logo" className="logo" />
               <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>
           
           
           <ul className="history">
            {
             allThreads?.map((thread,idx) => (
                <li key={idx} 
                onClick={(e)=>changeThread(thread.threadId)}
                className={currThreadId === thread.threadId ? "highlighted" : ""}
                >
                {thread.title}
                <i className="fa-solid fa-trash"
                  onClick={(e)=>{
                    e.stopPropagation();// event bubbling stop (child should not trigger parent event)
                    deleteThread(thread.threadId);
                  }}
                  ></i>
                 </li>
             ))
                }
             </ul>
          <p>👋 Hi, {user?.name}</p>
        <div className="sign">
        <p>By Apna College</p>
        </div>
         
        </section>
    )
}
export default Sidebar;