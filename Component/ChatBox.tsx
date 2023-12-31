import React, { useState } from "react";
import styles from "@/styles/Chatbox.module.css";
import { Button } from "react-bootstrap";
import { getChatResponse } from "@/Component/ApiLink";
import Image from "next/image";
import { useRouter } from "next/router";
require("dotenv").config();

const Chatbox = ({ ApiKey }: { ApiKey: string }) => {
  const router = useRouter();
  const [input, setInput] = useState<string>("");
  const [chat, setChat] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  function changeInput(e: any) {
    e.preventDefault();
    setInput(e.target.value);
  }
  async function getResponse() {
    setLoading(true);
    getChatResponse(input, ApiKey)
      .then((response) => {
        setChat([...chat, response]);
        setInput("");
        setLoading(false);
      })
      .catch((error) => console.error(error));
  }
  const additionalClass = router.pathname == "/" ? styles.chatboxb200 : " ";

  return (
    <div className={styles.chatbox + " " + additionalClass}>
      <div className={styles.chatIcon}>
        <label htmlFor="userChatInput">💬 Say Hello To My New Bot</label>
        <input
          style={{ width: "100%" }}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          className={styles.chatInput}
          value={input}
          id="userChatInput"
        />
        <Button className="mt-3" onClick={(e) => getResponse()}>
          Send
        </Button>
        {loading && (
          <span className="px-5">
            <Image
              src="https://i.ibb.co/LZDhRc6/g0R5.gif"
              alt="Loading Logo"
              width={50}
              height={50}
              priority
            />
          </span>
        )}
      </div>
      <div className={styles.chatContent}>
        {chat.map((message, index) => (
          <div key={index} className="d-flex">
            <div style={{ width: "20px" }}>*</div>
            <div style={{ width: "238px", textAlign: "justify" }}>
              {message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chatbox;
