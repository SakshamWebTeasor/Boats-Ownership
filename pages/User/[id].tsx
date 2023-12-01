import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "@/styles/UserDetail.module.css";
import { GetServerSideProps } from "next";
import { Boat } from "../Boats";
import Link from "next/link";
import Header from "@/Component/Header";
import { User } from "../Users";
import styles2 from "../../styles/Users.module.css";
import { Button } from "react-bootstrap";
import ApiLink from "../../Component/ApiLink";
import Image from "next/image";

interface UserDetailProps {
  boats: Boat[];
  user: User;
}

const UserDetail: React.FC<UserDetailProps> = ({ boats, user }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>{user?.name} - User Details</title>
      </Head>

      <div className={styles.container}>
        <Header Page="" PrePage="Users" />
        <section
          className={
            styles.userDetails +
            " d-flex flex-direction-column justify-content-between"
          }
        >
          <div>
            <h2>{user.name}&apos;s Details</h2>
            <p>
              <strong>ID:</strong> {user.id}
            </p>
            <p>
              <strong>Age:</strong> {user.age}
            </p>
          </div>
          <Image
            src={user.imgLink}
            alt={user.name}
            className={styles.userImage}
            width={750}
            height={750}
          />
        </section>
        <OwnedBoats boats={boats} user={user} />
      </div>
    </>
  );
};

const OwnedBoats: React.FC<UserDetailProps> = ({ boats, user }) => {
  return (
    <section className={styles.userBoats}>
      <h2>{user.name}&apos;s Boats</h2>
      {boats.length > 0 ? (
        <ul className={styles2.userList}>
          {boats.map((boat) => (
            <li key={boat.id} className={styles2.userItem}>
              <div>
                <h3>
                  <Link
                    href={`/Boat/${boat.id}`}
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    {boat.name}
                  </Link>
                </h3>
                <p>Type: {boat.type}</p>
              </div>
              <Link href={`/Boat/${boat.id}`}>
                <Image
                    src={boat.ImgLink}
                    alt={boat.name}
                    className={styles2.boatImage}
                    width={750}
                    height={750}
                  />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>{user.name} doesn&apos;t own any boats yet.</p>
      )}
    </section>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id }: any = params;
  const res = await fetch(`${ApiLink}/Users/${id}`);
  const user: User = await res.json();
  let fetchAllBoats: string = `${ApiLink}/Boats`;
  const allBoatsRes = await fetch(fetchAllBoats);
  const allBoats: Boat[] = await allBoatsRes.json();
  let userBoats: Boat[] = [];
  allBoats.map((boat) => {
    if (boat.OwnersUserId.includes(parseInt(id))) {
      userBoats.push(boat);
    }
  });
  return {
    props: {
      boats: userBoats,
      user,
    },
  };
};

export default UserDetail;
