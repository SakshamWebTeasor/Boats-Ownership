import React, { useState } from "react";
import styles from "@/styles/Chatbox.module.css";
import { Button } from "react-bootstrap";
import { getChatResponse } from "@/pages/api/ApiLink";

const Chatbox: React.FC = () => {
  const [input, setInput] = useState<string>("");
  function changeInput(e: any) {
    e.preventDefault();
    setInput(e.target.value);
  }
  function getResponse() {
    console.log(input);
    getChatResponse(input)
      .then((response) => console.log(response))
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
        <Button onClick={(e) => getResponse()}>Send</Button>
      </div>
      <div className={styles.chatContent}>
        {/* Add your chat content and logic here */}
        {/* This can include user messages, bot responses, input field, etc. */}
      </div>
    </div>
  );
};

export default Chatbox;
