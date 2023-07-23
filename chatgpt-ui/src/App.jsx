import { useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setTyping] = useState(false);

  const apiUrl = "http://localhost:8000/openai";

  const chat = async (e, message) => {
    e.preventDefault();

    if (!message) return;
    setTyping(true);
    scrollTo(0, 1e10);

    let msgs = chats;
    msgs.push({
      role: "user",
      content: message
    })
    setChats(msgs);

    setMessage("");

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chats,
      }),
    }).then((response) => response.json())
      .then(data => {
        msgs.push(data.output);
        setChats(msgs);
        setTyping(false);
        scrollTo(0, 1e10);
      })
      .catch((error) => {
        console.log(error);
      });

  }

  return (
    <>
      <h1>Chat gpt application</h1>

      <section>
        {chats && chats.length
          ? chats.map((chat, index) => (
            <p key={index} className={chat.role === "user" ? "user_msg" : ""}>
              <span>
                <b>{chat.role.toUpperCase()}</b>
              </span>
              <span>:</span>
              <span>{chat.content}</span>
            </p>
          ))
          : ""}
      </section>

      <div className={isTyping ? "" : "hide"}>
        <p>
          <i>{isTyping ? "Typing" : ""}</i>
        </p>
      </div>

      <form action="" onSubmit={(e) => chat(e, message)}>
        <input
          type="text"
          name="message"
          value={message}
          placeholder="Type a message here and hit Enter..."
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
    </>
  )
}

export default App
