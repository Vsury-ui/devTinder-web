import { use, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chaat = () => {
  const { targetUserId } = useParams();
  const user = useSelector((store) => store.user);
  const userId = user?._id;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const fetchChatMessages = async () => {
    try {
      const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });
      // setMessages(messages.data);
      const chatMessages = chat?.data?.messages.map((message) => {
        return {
          firstName: message.senderId.firstName,
          lastName: message.senderId.lastName,
          text: message.text,
        };
      });
      setMessages(chatMessages);
      // console.log(chatMessages);
    } catch (err) {
      console.log(err);
    }
  };

  const sendMessage = () => {
    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });
    setNewMessage("");
  };

  useEffect(() => {
    fetchChatMessages();
  }, []);

  useEffect(() => {
    if (!userId) return;
    // fetch messages for targetUserId
    const socket = createSocketConnection();
    socket.emit("joinChat", {
      firstName: user.firstName,
      lastName: user.lastName,
      targetUserId,
      userId,
    });

    socket.on("receiveMessage", ({ firstName, lastName, text }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { firstName, lastName, text },
      ]);
    });
    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);
  return (
    <div className="w-3/4 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col">
      <h1 className="p-5 border-b border-gray-600">Chat</h1>
      <div className="flex-1 overflow-scroll p-5">
        {messages.map((message, index) => {
          return (
            <div
              className={
                "chat " +
                (message.firstName === user.firstName
                  ? "chat-end"
                  : "chat-start")
              }
              key={index}
            >
              <div className="chat-header">
                {message.firstName + " " + message.lastName}
                <time className="text-xs opacity-50">2 hours ago</time>
              </div>
              <div className="chat-bubble">{message.text}</div>
              <div className="chat-footer opacity-50">Seen</div>
            </div>
          );
        })}
      </div>
      <div className="p-5 border-tborder-gray-600 flex items-center gap-2">
        <input
          className="flex-1 border border-gray-600 rounded-lg text-white"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        ></input>
        <button className="btn btn-secondary" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chaat;
