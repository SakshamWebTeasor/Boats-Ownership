import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import LoginModal from "../Modal/LoginModal";
import { ApiMainLink } from "../ApiLink";
import { showSwal } from "../SwalAlert";
import { useRouter } from "next/router";

interface BuyButtonProps {
  ownerIds: number[];
  boatId: number;
}

function BuyButton({ ownerIds, boatId }: BuyButtonProps) {
  const router = useRouter();
  const loggedInUser = useSelector((state: any) => state.reducer.userLoggedIn);
  const [showModal, setShowModal] = useState(false);
  const handleLoginModalClose = () => {
    setShowModal(false);
  };
  const handleBuyButtonClick = async () => {
    if (loggedInUser) {
      console.log(
        "User is logged in. Performing buy action... for boat:",
        boatId
      );
      try {
        const response = await fetch(`${ApiMainLink}/BuyBoat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loggedInUser.token}`, // Assuming you have a token for authorization
          },
          body: JSON.stringify({ boatId }),
        });
        const data = await response.json();
        if (response.ok) {
          console.log("Boat bought successfully:", data.message);
          showSwal("Buy Success", data.message, data.status, "/Boats", router);
        } else {
          console.error("Failed to buy boat:", data.message);
          showSwal("Buy Failed", data.message, data.status, undefined, router);
        }
      } catch (error: any) {
        showSwal("Buy Failed", error?.response?.message, 400, undefined, router);
        console.error("Error during buy action:", error);
      }
    } else {
      setShowModal(true);
    }
  };
  return (
    <>
      {showModal && <LoginModal onClose={handleLoginModalClose} />}
      {ownerIds.length == 0 ? (
        <Button className="mb-3 mt-5" onClick={handleBuyButtonClick}>
          Buy Now
        </Button>
      ) : (
        <Button className="mb-3 mt-5" onClick={handleBuyButtonClick}>
          Buy In Partnership
        </Button>
      )}
    </>
  );
}

export default BuyButton;
