import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Login.module.css"; // Make sure to create this CSS file
import Link from "next/link";

const LoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();
    router.push("/");
  };

  return (
    <div className={styles.container}>
      <h1>Login</h1>
      <form onSubmit={handleLogin} className={styles.form}>
        <label className={styles.label}>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
          />
        </label>
        <label className={styles.label}>
          Password:
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
