import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "@/styles/BoatDetail.module.css";
import { GetServerSideProps } from "next";
import { Boat } from "../Boats";
import Link from "next/link";
import Header from "@/Component/Header";
import { User } from "../Users";
import styles2 from "../../styles/Users.module.css";
import ApiLink from "../../Component/ApiLink";
import Image from "next/image";
import BuyButton from "@/Component/Button/BuyButton";
import BoatBookings from "@/Component/BoatBookings";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

export interface BoatBooking {
  id: number;
  boatId: number;
  userId: number;
  BookingDate: string;
  From: string;
  To: string;
  Approved: boolean;
  Status: string;
  NeedApprovalFrom: number[];
  ApprovedBy: number[];
  MustBeApproveBefore: string;
}
interface BoatDetailProps {
  boat: Boat;
  users: User[];
  boatBookings: BoatBooking[];
}

const BoatDetail: React.FC<BoatDetailProps> = ({
  boat,
  users,
  boatBookings,
}) => {
  const router = useRouter();
  const user = useSelector((state: any) => state.reducer.userLoggedIn);
  const [decoded, setDecoded] = useState<any>({});
  useEffect(() => {
    if (user?.token) {
      const decodedToken = jwtDecode(user.token);
      setDecoded(decodedToken);
    }
  }, [user]);
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Head>
        <title>{boat.name} - Boat Details</title>
      </Head>
      <div className={styles.container}>
        <Header Page="" PrePage="Boats" />
        <div className="d-flex flex-direction-column justify-content-between">
          <div>
            {/* className="d-flex flex-direction-column justify-content-between" */}
            <h1>{boat.name}</h1>
            <p>Type: {boat.type}</p>
            <p>Length: {boat.length} ft</p>
            <p>Capacity: {boat.capacity}</p>
            <p>Location: {boat.location}</p>
            <p>Sold: {boat.Sold ? "Yes" : "No"}</p>
            {!boat.Sold && <p>Price: ${boat.Price}</p>}
          </div>
          {users.length > 0 && (
            <div className="Owners DSM-None">
              <h2>Owners:-</h2>
              <Owners users={users} />
            </div>
          )}
        </div>
        {users.length > 0 && (
          <div className="Owners DSM-Block mt-5">
            <h2>Owners:-</h2>
            <Owners users={users} />
          </div>
        )}
        <Image
          src={boat.ImgLink}
          alt={boat.name}
          className={styles.boatImage}
          width={1050}
          height={750}
        />
        <BuyButton ownerIds={boat.OwnersUserId} />
        <BoatBookings
          ownerIds={boat.OwnersUserId}
          myUserIdExists={{bool:boat.OwnersUserId.includes(decoded?.id),myId:decoded?.id}}
          bookings={boatBookings}
          users={users}
        />
      </div>
    </>
  );
};

const Owners: React.FC<{ users: User[] }> = ({ users }) => {
  return (
    <ul className={styles.userList}>
      {users.map((user) => {
        return (
          <li key={user.id} style={{ color: "white", listStyleType: "none" }}>
            <p className="d-flex flex-direction-column justify-content-between">
              {/* <p>Name: </p> */}
              <Link
                className="mx-4"
                href={`/User/${user.id}`}
                style={{ color: "white", textDecoration: "none" }}
              >
                {user.name}
              </Link>
              <Link href={`/User/${user.id}`}>
                <Image
                  src={user.imgLink}
                  alt={user.name}
                  className={styles2.userImage}
                  width={750}
                  height={750}
                />
              </Link>
            </p>
          </li>
        );
      })}
    </ul>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id }: any = params;
  const res = await fetch(`${ApiLink}/Boats/${id}`);
  const boat: Boat = await res.json();
  const response = await fetch(`${ApiLink}/BoatBookings?boatId=${id}`);
  const bookingData: BoatBooking[] = await response.json();
  let urlForUsers: string = `${ApiLink}/Users?`;
  boat.OwnersUserId.map((id, index) => {
    let addAnd: boolean = boat.OwnersUserId.length - 1 !== index;
    let contentToAdd: string = "id=" + id + (addAnd ? "&" : "");
    urlForUsers += contentToAdd;
  });
  let userRes: any;
  let users: User[] = [];
  if (urlForUsers !== `${ApiLink}/Users?`) {
    userRes = await fetch(urlForUsers);
    users = await userRes.json();
  }
  return {
    props: {
      boat,
      users,
      boatBookings: bookingData,
    },
  };
};

export default BoatDetail;
