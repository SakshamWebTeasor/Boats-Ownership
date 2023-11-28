import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Login.module.css"; // Make sure to create this CSS file
import Link from "next/link";
import { ApiMainLink } from "@/Component/ApiLink";

const LoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch(`${ApiMainLink}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: username, password }),
      });
      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        localStorage.setItem("token", token);
        router.push("/");
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Login</h1>
      <form onSubmit={handleLogin} className={styles.form}>
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
          <span>Password:</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
        </label>
        <button type="submit" className={styles.button}>
          Login
        </button>
        <div className="d-flex justify-content-end mt-3">
          <Link href="/Register">
            <button className={styles.button}>Create Account</button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
