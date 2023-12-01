import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Register.module.css";
import ApiLink from "@/Component/ApiLink";
import Header from "@/Component/Header";

const RegisterPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imgLink, setImgLink] = useState("");
  const [age, setAge] = useState("");

  const handleRegister = async (e: any) => {
    e.preventDefault();
    const userData = {
      name: username,
      email: email,
      password: password,
      imgLink: imgLink,
      age: age,
    };

    try {
      // Make a POST request to the Users endpoint on JSON Server
      const response = await fetch(`${ApiLink}/Users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        console.log("User registered successfully!");
        // Redirect to the home page after successful registration
        router.push("/");
      } else {
        console.error("Registration failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }

    router.push("/");
  };

  return (
    <div className={styles.container}>
      <div style={{ width: "95%", position: "fixed", top: "15px", textAlign: "-webkit-center" }}>
        <Header Page="Add Boat" PrePage="Home" />
      </div>
      <div
        style={{
          top: "150px",
          position: "fixed",
        }}
      >
        <h1>Register</h1>
        <form onSubmit={handleRegister} className={styles.form}>
          <label className={styles.label + " d-flex justify-content-between"}>
            <span>Username:</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
            />
          </label>
          <label className={styles.label + " d-flex justify-content-between"}>
            <span>Image Link:</span>
            <input
              type="url"
              value={imgLink}
              onChange={(e) => setImgLink(e.target.value)}
              className={styles.input}
            />
          </label>
          <label className={styles.label + " d-flex justify-content-between"}>
            <span>Age:</span>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className={styles.input}
            />
          </label>
          <label className={styles.label + " d-flex justify-content-between"}>
            <span>Email:</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
          </label>
          <label className={styles.label + " d-flex justify-content-between"}>
            <span>Password:</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />
          </label>
          <button type="submit" className={styles.button}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
