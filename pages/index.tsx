import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import type { InferGetStaticPropsType, GetStaticProps } from "next";
import Link from "next/link";
import ApiLink from "../Component/ApiLink";
import UserLoggedIn from "@/Component/UserLoggedIn";
import { useDispatch } from "react-redux";
import { setApiKey } from "@/Component/redux/action";
require("dotenv").config();

const inter = Inter({ subsets: ["latin"] });

type Repo = {
  ip: string;
  boatsImg: string[];
  ApiKey: string;
};

export const getStaticProps: GetStaticProps<{ repo: Repo }> = async () => {
  const ApiKey = process.env.API_KEY || "";
  const res = await fetch("https://api.ipify.org?format=json");
  const BoatsImage = await fetch(`${ApiLink}/BoatsImage`);
  const data = await res.json();
  const boatsImg: string[] = await BoatsImage.json();
  const repo = { ...data, boatsImg, ApiKey };
  return { props: { repo }, revalidate: 60 };
};

export default function Home({
  repo,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const dispatch = useDispatch();
  dispatch(setApiKey(repo.ApiKey));
  return (
    <>
      <Head>
        <title>Boat Co-ownership</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.description}>
          <p>
            <Link href="/Boats">Our Boats</Link>
            <Link href="/Users">Our Users</Link>
            <Link href="/About">About Us</Link>
            <Link href="/Purchase">Purchase & Partnership</Link>
            <span
              className={
                styles.show700None + " d-flex justify-content-center d-md-none"
              }
            >
              <Image
                className={styles.logo + ""}
                src="/BoatsLogo/SimpleB.png"
                alt="Next.js Logo"
                width={100}
                height={50}
                priority
              />
            </span>
          </p>
          <div>
            <a
              href="https://webteasor.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Built By{" "}
              <Image
                src="/icon-512x512.png"
                alt="Vercel Logo"
                className={styles.vercelLogo}
                width={100}
                height={100}
                priority
              />
            </a>
          </div>
        </div>
        <div className={styles.center}>
          <Image
            className={styles.logo}
            src="/BoatsLogo/SimpleB.png"
            alt="Next.js Logo"
            width={180}
            height={90}
            priority
          />
          <div>We Bring Adventure In Your Life</div>
        </div>
        <div className={styles.row}>
          {repo.boatsImg?.map((img, index) => (
            <div key={index} className={styles.column}>
              <Image
                loading="eager"
                src={img}
                alt={`Boat ${index + 1}`}
                className={styles.boatImage}
                width={(index == 7 || index == 2) ? 550 : 750}
                height={(index == 7 || index == 2) ? 550 : 750}
              />
            </div>
          ))}
        </div>
        <div>
          <UserLoggedIn />
        </div>
      </main>
    </>
  );
}
