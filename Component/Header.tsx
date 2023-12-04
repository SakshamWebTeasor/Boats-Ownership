import React, { useEffect, useState } from "react";
import styles from "../styles/Boats.module.css";
import { Button } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";
import styles2 from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import Chatbox from "./ChatBox";
import UserLoggedIn from "./UserLoggedIn";

function Header({ Page, PrePage }: { Page: string; PrePage: string }) {
  const router = useRouter();
  const [apiKey, setApiKey] = useState<string | null>("");
  const pathname = router.pathname;
  const setKey = () => {
    setApiKey(localStorage.getItem("ApiKey"));
  };
  useEffect(() => {
    setKey();
  }, []);
  return (
    <div>
      <div className={styles2.description}>
        <p className="d-flex justify-content-between align-items-center">
          <Button
            type="button"
            className="btn btn-dark mb-3 "
            onClick={() => window.history.back()}
          >
            &lt;
          </Button>
          {`Our ${Page}` == "Our Boats" ? (
            <cite style={{ fontSize: "24px" }}>Our Boats </cite>
          ) : (
            <Link href="/Boats">Our Boats</Link>
          )}
          {`Our ${Page}` == "Our Users" ? (
            <cite style={{ fontSize: "24px" }}>Our Users </cite>
          ) : (
            <Link href="/Users">Our Users</Link>
          )}
          {Page == "About" ? (
            <cite style={{ fontSize: "24px" }}>About Us </cite>
          ) : (
            <Link href="/About">About Us</Link>
          )}
          {Page == "Purchase" ? (
            <cite style={{ fontSize: "18px" }}>
              Purchase&nbsp;&
              <br />
              Partnership
            </cite>
          ) : (
            <Link href="/Purchase">
              Purchase&nbsp;&
              <br />
              Partnership
            </Link>
          )}
          <span>
            <Link href="/" style={{ color: "white", textDecoration: "none" }}>
              <Image loading="lazy"
                className={styles.logo + " mx-3"}
                src="/BoatsLogo/SimpleW.png"
                alt="Next.js Logo"
                width={100}
                height={50}
                priority
              />
            </Link>
          </span>
        </p>
      </div>
      <div style={{ marginTop: "120px" }} className={styles2.show700None}>
        <div
          className={
            styles2.show625flex + " justify-content-between align-items-center"
          }
        >
          <Button
            type="button"
            className="btn btn-dark mb-3 "
            onClick={() => window.history.back()}
          >
            &lt;
          </Button>
          <Button type="button" className="btn btn-dark mb-3 ">
            <Link
              href={`/${PrePage == "Home" ? "" : PrePage}`}
              style={{ color: "white", textDecoration: "none" }}
            >
              {PrePage}
            </Link>
          </Button>
          <Link href="/" style={{ color: "white", textDecoration: "none" }}>
            <Image loading="lazy"
              className={styles.logo}
              src="/BoatsLogo/SimpleW.png"
              alt="Next.js Logo"
              width={100}
              height={50}
              priority
            />
          </Link>
        </div>
      </div>
      <div>
        {/* {Page!="Edit Profile" && <UserLoggedIn />} */}
      </div>
    </div>
  );
}

export default Header;
