import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Login.module.css";
import Link from "next/link";
import { ApiMainLink } from "@/Component/ApiLink";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/Component/redux/action";
import { showSwal } from "@/Component/SwalAlert";

const LoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const response: any = await fetch(`${ApiMainLink}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: username, password }),
      });
      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        dispatch(loginSuccess({ ...data.data.user, token }));
        localStorage.setItem("token", token);
        showSwal("Logged in successfully!", "success", 200, "/", router);
        router.push("/");
      } else {
        showSwal("Login failed!", response?.message, 400, undefined, router);
        console.error("Login failed");
      }
    } catch (error: any) {
      showSwal("Login failed!", error?.response?.message, 400, undefined, router);
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
            <button className={styles.button}>Register</button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
