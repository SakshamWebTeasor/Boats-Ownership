import React from "react";
import styles from "../styles/Boats.module.css";
import { Button } from "react-bootstrap";
import Link from "next/link";
import { User } from "./Users";
import Header from "@/Component/Header";
import ApiLink from "./api/ApiLink";
import Image from "next/image";

export interface Boat {
  id: number;
  name: string;
  type: string;
  length: number;
  capacity: number;
  location: string;
  Sold: boolean;
  OwnersUserId: number[];
  Price: number;
  ImgLink: string;
}

interface BoatsProps {
  boats: Boat[];
  users: User[];
}

const Boats: React.FC<BoatsProps> = ({ boats, users }) => {
  return (
    <div className={styles.container}>
      <Header Page="Boats" PrePage="Home" />
      <ul className={styles.boatList}>
        {boats.map((boat) => {
          return (
            <li key={boat.id} className={styles.boatItem}>
              <div className="d-flex flex-direction-column justify-content-between">
                <div>
                  <h2>{boat.name}</h2>
                  <p>Type: {boat.type}</p>
                  <p>Length: {boat.length} ft</p>
                  <p>Capacity: {boat.capacity}</p>
                  <p>Location: {boat.location}</p>
                  <p>Sold: {boat.Sold ? "Yes" : "No"}</p>
                  <p>Price: ${boat.Price}</p>
                </div>
                <div className="d-flex flex-column">
                  {boat.OwnersUserId.length == 0 ? (
                    <Button className="mb-3">Buy Now</Button>
                  ) : (
                    <Button className="mb-3">Buy Partnership</Button>
                  )}
                  <Button className="mb-3">
                    <Link
                      href={`/Boat/${boat.id}`}
                      style={{ color: "white", textDecoration: "none" }}
                    >
                      View Details
                    </Link>
                  </Button>
                  {boat.OwnersUserId.length > 0 ? (
                    <>
                      <h5 className="mx-2">Owners :-</h5>
                      {boat.OwnersUserId.map((userId) => {
                        let ThisUser: User[] = users.filter(
                          (user) => user.id === userId
                        );
                        return (
                          <p key={userId} className="mx-3">
                            <Link
                              href={`/User/${userId}`}
                              style={{ color: "white", textDecoration: "none" }}
                            >
                              {ThisUser[0].name}
                            </Link>
                          </p>
                        );
                      })}
                    </>
                  ) : (
                    <h5>No Owners Yet</h5>
                  )}
                </div>
              </div>
              <Image
                src={boat.ImgLink}
                alt={boat.name}
                className={styles.boatImage}
                width={750}
                height={750}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export async function getServerSideProps() {
  const res = await fetch(`${ApiLink}/Boats`);
  const boats: Boat[] = await res.json();
  let userIds: number[] = [];
  boats.map((boat) => {
    userIds.push(...boat.OwnersUserId);
  });
  let urlForUsers: string = `${ApiLink}/Users?`;
  userIds.map((id, index) => {
    let addAnd: boolean = userIds.length - 1 !== index;
    let contentToAdd: string = "id=" + id + (addAnd ? "&" : "");
    urlForUsers += contentToAdd;
  });
  const userRes = await fetch(urlForUsers);
  const users: User[] = await userRes.json();
  return {
    props: { boats, users },
  };
}

export default Boats;
