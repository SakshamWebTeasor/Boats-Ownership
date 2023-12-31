import React, { useState, useEffect } from "react";
import styles from "../styles/Boats.module.css";
import { Button } from "react-bootstrap";
import Link from "next/link";
import { User } from "./Users";
import Header from "@/Component/Header";
import ApiLink from "../Component/ApiLink";
import Image from "next/image";
import BuyButton from "@/Component/Button/BuyButton";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

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
  const user = useSelector((state: any) => state.reducer.userLoggedIn);
  const [decoded, setDecoded] = useState<any>({});
  useEffect(() => {
    if (user?.token) {
      const decodedToken = jwtDecode(user.token);
      setDecoded(decodedToken);
    }
  }, [user]);
  return (
    <div className={styles.container}>
      <Header Page="Boats" PrePage="Home" />
      <ul className={styles.boatList}>
        {boats.length > 0 ? (
          boats.map((boat, index) => {
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
                    <BuyButton ownerIds={boat.OwnersUserId} boatId={boat.id} />
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
                                style={{
                                  color: "white",
                                  textDecoration: "none",
                                }}
                              >
                                {ThisUser[0].name}
                              </Link>
                            </p>
                          );
                        })}
                      </>
                    ) : (
                      <h5>No Owner Yet</h5>
                    )}
                  </div>
                </div>
                <Image
                  src={boat.ImgLink}
                  alt={boat.name}
                  className={styles.boatImage}
                  width={1050}
                  height={1050}
                  loading="eager"
                />
              </li>
            );
          })
        ) : (
          <>
            <div>No Boat To List</div>
          </>
        )}
      </ul>
      {decoded.role === "admin" && (
        <Button className="mb-3">
          <Link
            href="/AddBoat"
            style={{ color: "white", textDecoration: "none" }}
          >
            Add New Boat
          </Link>
        </Button>
      )}
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
