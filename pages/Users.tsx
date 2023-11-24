import React from "react";
import styles from "../styles/Users.module.css";
import Link from "next/link";
import { Boat } from "./Boats";
import Header from "@/Component/Header";
import { Button } from "react-bootstrap";
import ApiLink from "../Component/ApiLink";
import Image from "next/image";

export interface User {
  id: number;
  name: string;
  age: string;
  imgLink: string;
}

interface UsersProps {
  users: User[];
  boats: Boat[];
}

const Users: React.FC<UsersProps> = ({ users, boats }) => {
  return (
    <div className={styles.container}>
      <Header Page="Users" PrePage="Home" />
      <ul className={styles.userList}>
        {users.map((user) => {
          let UserOwnedBoat = boats.filter((boat) =>
            boat.OwnersUserId.includes(user.id)
          );
          return (
            <li key={user.id} className={styles.userItem}>
              <div className="d-flex flex-direction-column justify-content-between">
                <div>
                  <Image
                    src={user.imgLink}
                    alt={user.name}
                    className={styles.userImage}
                    width={750}
                    height={750}
                  />
                  <h2>{user.name}</h2>
                  <p>Age: {user.age}</p>
                  <Button className="mt-3">
                    <Link
                      href={`/User/${user.id}`}
                      style={{ color: "white", textDecoration: "none" }}
                    >
                      View Detail
                    </Link>
                  </Button>
                </div>
                <div>
                  <h3>Owned Boat</h3>
                  <ul className={styles.userList}>
                    {UserOwnedBoat.map((boat) => {
                      return (
                        <li key={boat.id}>
                          <p>
                            Name:{" "}
                            <Link
                              href={`/Boat/${boat.id}`}
                              style={{ color: "white", textDecoration: "none" }}
                            >
                              {boat.name}
                            </Link>
                          </p>
                          <Link
                            href={`/Boat/${boat.id}`}
                            style={{ color: "white", textDecoration: "none" }}
                          >
                            <Image
                              src={boat.ImgLink}
                              alt={boat.name}
                              className={styles.boatImage}
                              width={750}
                              height={750}
                            />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export async function getServerSideProps() {
  const res = await fetch(`${ApiLink}/Users`);
  const users: User[] = await res.json();
  const boatRes = await fetch(`${ApiLink}/Boats`);
  const boats: Boat[] = await boatRes.json();
  return {
    props: { users, boats },
  };
}

export default Users;
