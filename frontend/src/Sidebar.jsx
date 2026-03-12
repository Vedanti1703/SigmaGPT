import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";
import { AuthContext } from "./AuthContext";

function Sidebar() {

  const { user } = useContext(AuthContext);

  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChats,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats
  } = useContext(MyContext);


  // FETCH ALL THREADS
  const getAllThreads = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://sigmagptbackend-63vd.onrender.com/api/thread",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const res = await response.json();

      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title
      }));

      console.log("Threads fetched:", filteredData);

      setAllThreads(filteredData);

    } catch (err) {
      console.log("Error fetching threads:", err);
    }

  };


  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);


  // CREATE NEW CHAT
  const createNewChat = () => {

    setNewChats(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);

  };


  // CHANGE THREAD
  const changeThread = async (newThreadId) => {

    setCurrThreadId(newThreadId);

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://sigmagptbackend-63vd.onrender.com/api/thread/${newThreadId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const res = await response.json();

      console.log(res);

      setPrevChats(res);
      setNewChats(false);
      setReply(null);

    } catch (err) {
      console.log(err);
    }

  };


  // DELETE THREAD
  const deleteThread = async (threadId) => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://sigmagptbackend-63vd.onrender.com/api/thread/${threadId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const res = await response.json();

      console.log(res);

      // update sidebar
      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== threadId)
      );

      if (threadId === currThreadId) {
        createNewChat();
      }

    } catch (err) {
      console.log(err);
    }

  };


  return (

    <section className="sidebar">

      {/* NEW CHAT BUTTON */}
      <button onClick={createNewChat}>
        <img
          src="src/assets/blacklogo.png"
          alt="gpt logo"
          className="logo"
        />
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>


      {/* THREAD HISTORY */}
      <ul className="history">

        {allThreads?.map((thread, idx) => (

          <li
            key={idx}
            onClick={() => changeThread(thread.threadId)}
            className={
              currThreadId === thread.threadId
                ? "highlighted"
                : ""
            }
          >

            {thread.title}

            <i
              className="fa-solid fa-trash"
              onClick={(e) => {
                e.stopPropagation();
                deleteThread(thread.threadId);
              }}
            ></i>

          </li>

        ))}

      </ul>


      {/* USER INFO */}
      <p>👋 Hi, {user?.name}</p>

      <div className="sign">
        <p>By Apna College</p>
      </div>

    </section>

  );
}

export default Sidebar;