import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import Link from "next/link";
import ApiLink from "./api/ApiLink";

const inter = Inter({ subsets: ["latin"] });

type Repo = {
  ip: string;
  boatsImg: string[];
};

export const getServerSideProps: GetServerSideProps<{ repo: Repo }> = async (
  context
) => {
  const res = await fetch("https://api.ipify.org?format=json");
  const BoatsImage = await fetch(`${ApiLink}/BoatsImage`);
  const data = await res.json();
  const boatsImg: string[] = await BoatsImage.json();
  const repo = { ...data, boatsImg };
  return { props: { repo } };
};

export default function Home({
  repo,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.description}>
          <p>
            <Link href="/Boats">Our Boats</Link>
            <Link href="/Users">Our Customers</Link>
            <Link href="/About">About Us</Link>
            <span className="d-flex justify-content-center d-md-none">
              <Image
                className={styles.logo + " mx-3"}
                src="/BoatsLogo/SimpleB.png"
                alt="Next.js Logo"
                width={100}
                height={50}
                priority
              />
            </span>
            {/* <code className={styles.code}>pages/index.tsx</code> */}
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
        {/* <div>
          {repo.boatsImg?.map((img) => {
            return (
              <img
                src={img}
                alt="Next.js Logo"
                style={{ width: "100%" }}
                key={img}
              ></img>
            );
          })}
        </div> */}
        <div className={styles.row}>
          {repo.boatsImg?.map((img, index) => (
            <div key={index} className={styles.column}>
              <img
                src={img}
                alt={`Boat ${index + 1}`}
                style={{ width: "100%" }}
              />
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

// BoatsImage
