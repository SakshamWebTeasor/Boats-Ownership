import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Register.module.css";
import ApiLink from "@/Component/ApiLink";
import Header from "@/Component/Header";
import { showSwal } from "@/Component/SwalAlert";

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
      const response:any = await fetch(`${ApiLink}/Users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (response.ok) {
        showSwal("Success", "Registration successful", 200, "/", router);
      } else {
        showSwal("Registration failed", response?.message, 500, undefined, router);
        console.error("Registration failed:", response.statusText);
      }
    } catch (error:any) {
      showSwal("Registration failed", error?.response?.message, 500, undefined, router);
      console.error("Error during registration:", error);
    }
    router.push("/");
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerDiv}>
        <Header Page="Add Boat" PrePage="Home" />
      </div>
      <div className={styles.bodyDiv}>
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
