import React, { useState } from "react";
import styles from "@/styles/ShowProfile.module.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./redux/action";
import Link from "next/link";
import { Button } from "react-bootstrap";
import Chatbox from "./ChatBox";
import { useRouter } from "next/router";

const UserLoggedIn = () => {
  const [showProfile, setShowProfile] = useState(false);
  const dispatch = useDispatch();
  const allData = useSelector((state: any) => state.reducer);
  const { ApiKey, userLoggedIn } = allData;
  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };
  const handleLogout = () => {
    dispatch(logout());
  };

  const router = useRouter();

  return (
    <div
      className={
        router.pathname != "/" ? styles.userLoggedIn2 : styles.userLoggedIn
      }
    >
      <button className={styles.profileButton} onClick={toggleProfile}>
        {showProfile ? "Hide Menu" : "Show Menu"}
      </button>
      {showProfile && (
        <div className={styles.profileContainer}>
          {userLoggedIn ? (
            <>
              <div>Hello&nbsp;{userLoggedIn.name}&nbsp;!</div>
              <Link href="/Profile">
                <Button className={styles.button + " btn btn-danger"}>
                  Edit&nbsp;Your&nbsp;Profile
                </Button>
              </Link>
              <Button
                className={styles.button + " btn btn-danger"}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/Login">Login</Link>
          )}
        </div>
      )}
      <Chatbox ApiKey={ApiKey} />
    </div>
  );
};

export default UserLoggedIn;
