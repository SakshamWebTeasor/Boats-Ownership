import React, { useState } from "react";
import styles from "@/styles/Chatbox.module.css";
import { Button } from "react-bootstrap";
import { getChatResponse } from "@/Component/ApiLink";
import Image from "next/image";
require("dotenv").config();

const Chatbox = ( {ApiKey}: {ApiKey: string} ) => {
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
        console.log(response);
        setChat([...chat, response]);
        setInput("");
        setLoading(false);
      })
      .catch((error) => console.error(error));
  }
  return (
    <div className={styles.chatbox}>
      <div className={styles.chatIcon}>
        💬
        <input
          onChange={(e) => changeInput(e)}
          type={"text"}
          className={styles.chatInput}
          value={input}
        ></input>
        <Button className="mt-3" onClick={(e) => getResponse()}>
          Send
        </Button>
        {loading && (
          <span className="px-5">
            <Image
              src="/BoatsLogo/g0r5.gif"
              alt="Loading Logo"
              width={50}
              height={50}
              priority
            />
          </span>
        )}
      </div>
      <div className={styles.chatContent}>
        {/* Add your chat content and logic here */}
        {chat.map((message, index) => (
          <div key={index} className="d-flex">
            <div style={{ width: "20px" }}>*</div>
            <div style={{ width: "238px", textAlign: "justify" }}>
              {message}
            </div>
          </div>
        ))}
        {/* This can include user messages, bot responses, input field, etc. */}
      </div>
    </div>
  );
};

export default Chatbox;
