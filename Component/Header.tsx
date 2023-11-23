import React from "react";
import styles from "../styles/Boats.module.css";
import { Button } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";

function Header({ Page, PrePage }: { Page: string; PrePage: string }) {
  return (
    <div>
      <div
        style={{ position: "relative" }}
        className="d-flex justify-content-between"
      >
        <Button type="button" className="btn btn-dark mb-3 ">
          <Link
            href={`/${PrePage == "Home" ? "" : PrePage}`}
            style={{ color: "white", textDecoration: "none" }}
          >
            &lt; &nbsp;Back To {PrePage}
          </Link>
        </Button>
        {Page !== "" && (
          <div className="SM-Font DSM-None">
            {Page == "About" ? "About Us" : `Our ${Page}`}
          </div>
        )}
        <div className=" align-self-center">
          <Link href="/" style={{ color: "white", textDecoration: "none" }}>
            <Image
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
      <div className="DSM-Block-F">
      {Page !== "" && (
          <div className="SM-Font">
            {Page == "About" ? "About Us" : `Our ${Page}`}
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
