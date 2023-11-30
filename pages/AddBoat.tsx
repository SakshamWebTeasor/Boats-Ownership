import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Register.module.css";
import ApiLink from "@/Component/ApiLink";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

const AddBoatPage = () => {
  const router = useRouter();
  const user = useSelector((state: any) => state.reducer.userLoggedIn);
  const [decoded, setDecoded] = useState<any>({});
  const [boatName, setBoatName] = useState("");
  const [boatType, setBoatType] = useState("");
  const [boatLength, setBoatLength] = useState("");
  const [boatCapacity, setBoatCapacity] = useState("");
  const [boatLocation, setBoatLocation] = useState("");
  const [boatPrice, setBoatPrice] = useState("");
  const [boatImgLink, setBoatImgLink] = useState("");
  
  useEffect(() => {
    if (user?.token) {
      const decodedToken = jwtDecode(user.token);
      setDecoded(decodedToken);
    }
  }, [user]);

  const handleAddBoat = async (e: any) => {
    e.preventDefault();
    const boatData = {
      name: boatName,
      type: boatType,
      length: parseInt(boatLength),
      capacity: parseInt(boatCapacity),
      location: boatLocation,
      Price: parseInt(boatPrice),
      ImgLink: boatImgLink,
      Sold: false,
      OwnersUserId: [],
    };
    try {
      const response = await fetch(`${ApiLink}/Boats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(boatData),
      });
      if (response.ok) {
        console.log("Boat added successfully!");
        router.push("/Boats");
      } else {
        console.error("Boat addition failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error during boat addition:", error);
    }
  };
  return (
    <div className={styles.container}>
      <h1>Add Boat</h1>
      {decoded.role == "admin" ? (
        <form onSubmit={handleAddBoat} className={styles.form}>
          <label className={styles.label + " d-flex justify-content-between"}>
            <span>Boat Name:</span>
            <input
              type="text"
              value={boatName}
              onChange={(e) => setBoatName(e.target.value)}
              className={styles.input}
            />
          </label>
          <label className={styles.label + " d-flex justify-content-between"}>
            <span>Boat Type:</span>
            <input
              type="text"
              value={boatType}
              onChange={(e) => setBoatType(e.target.value)}
              className={styles.input}
            />
          </label>
          <label className={styles.label + " d-flex justify-content-between"}>
            <span>Boat Length:</span>
            <input
              type="number"
              value={boatLength}
              onChange={(e) => setBoatLength(e.target.value)}
              className={styles.input}
            />
          </label>
          <label className={styles.label + " d-flex justify-content-between"}>
            <span>Boat Capacity:</span>
            <input
              type="number"
              value={boatCapacity}
              onChange={(e) => setBoatCapacity(e.target.value)}
              className={styles.input}
            />
          </label>
          <label className={styles.label + " d-flex justify-content-between"}>
            <span>Boat Location:</span>
            <input
              type="text"
              value={boatLocation}
              onChange={(e) => setBoatLocation(e.target.value)}
              className={styles.input}
            />
          </label>
          <label className={styles.label + " d-flex justify-content-between"}>
            <span>Boat Price:</span>
            <input
              type="number"
              value={boatPrice}
              onChange={(e) => setBoatPrice(e.target.value)}
              className={styles.input}
            />
          </label>
          <label className={styles.label + " d-flex justify-content-between"}>
            <span>Boat Image Link:</span>
            <input
              type="url"
              value={boatImgLink}
              onChange={(e) => setBoatImgLink(e.target.value)}
              className={styles.input}
            />
          </label>
          <button type="submit" className={styles.button}>
            Add Boat
          </button>
        </form>
      ) : (
        <>
          <p>Only Admin Can Add Boats</p>
        </>
      )}
    </div>
  );
};

export default AddBoatPage;
