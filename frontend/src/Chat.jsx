import "./Chat.css";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat({ sentiments = {} }) {

  const { prevChats, newChats, reply } = useContext(MyContext);

  const [latestReply, setLatestReply] = useState(null);


  // Typing effect for latest reply
  useEffect(() => {

    if (reply === null) {
      setLatestReply(null);
      return;
    }

    const content = (reply || "").split("");

    let index = 0;

    const interval = setInterval(() => {

      setLatestReply(content.slice(0, index + 1).join(""));
      index++;

      if (index === content.length) {
        clearInterval(interval);
      }

    }, 40);

    return () => clearInterval(interval);

  }, [reply]);


  return (
    <>
      {newChats && <h1>Start a new chat</h1>}

      <div className="chats">

        {prevChats?.slice(0, -1).map((chat, idx) => (

          <div
            className={chat.role === "user" ? "userDiv" : "gptDiv"}
            key={idx}
          >

            {chat.role === "user" ? (

             <div className="userMessageWrapper">
                <p className="userMessage">{chat.content}</p>
                {sentiments[idx] && (
                  <span
                    className="sentimentEmoji"
                    title="Sentiment detected by deep learning model"
                  >
                    {sentiments[idx]}
                  </span>
                )}
              </div>

            ) : (

              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {String(chat.content || "")}
              </ReactMarkdown>

            )}

          </div>

        ))}


        {/* Typing reply */}
        {prevChats.length > 0 && latestReply !== null && (

          <div className="gptDiv">

            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {latestReply}
            </ReactMarkdown>

          </div>

        )}


        {/* Load previous chats */}
        {prevChats.length > 0 && latestReply === null && (

          <div className="gptDiv">

            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {prevChats[prevChats.length - 1]?.content}
            </ReactMarkdown>

          </div>

        )}

      </div>
    </>
  );
}

export default Chat;