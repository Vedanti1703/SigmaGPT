import "./Chat.css";
import { MyContext } from './MyContext.jsx';
import { useContext, useState, useEffect, use } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
  const { prevChats, newChats, reply } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);



  //latest reply seperate=> typing effect
  useEffect(() => {
    if (reply === null){
      setLatestReply(null);// previous chat load
       return;
    }

    if (!prevChats.length) return;

    const content = reply.split("");

    let idx = 0;
    const interval = setInterval(() => {
      setLatestReply(content.slice(0, idx + 1).join(""));
      idx++;
      if (idx === content.length) {
        clearInterval(interval);
      }
      return () => clearInterval(interval);
    }, 40);

  }, [prevChats, reply]);//dependency


  return (
    <>
      {newChats && <h1>Start a new chat </h1>}
      <div className="chats">

        {
          prevChats?.slice(0, -1).map((chat, idx) =>
            <div className={chat.role === "user" ? "userDiv" : "gptDiv"} key={idx}>
              {
                chat.role === "user" ?
                  <p className="userMessage">{chat.content}</p> :
                  <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                    {String(chat.content || "")}
                  </ReactMarkdown>
              }
            </div>
          )
        }

        {
          prevChats.length > 0 && latestReply !== null &&
          <div className="gptDiv" key={"typing"}><ReactMarkdown rehypePlugins={[rehypeHighlight]}>
            {latestReply}
          </ReactMarkdown> </div>
        }

         {//prev chats load 
          prevChats.length > 0 && latestReply === null &&
          <div className="gptDiv" key={"non-typing"}><ReactMarkdown rehypePlugins={[rehypeHighlight]}>
            {prevChats[prevChats.length - 1].content}
          </ReactMarkdown> </div>
        }

      </div>
    </>
  );
}

export default Chat;