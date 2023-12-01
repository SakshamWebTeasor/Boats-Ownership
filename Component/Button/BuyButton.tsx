import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import LoginModal from "../Modal/LoginModal";
import { ApiMainLink } from "../ApiLink";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

interface BuyButtonProps {
  ownerIds: number[];
  boatId: number;
}

function BuyButton({ ownerIds, boatId }: BuyButtonProps) {
  const loggedInUser = useSelector((state: any) => state.reducer.userLoggedIn);
  const [showModal, setShowModal] = useState(false);
  const handleLoginModalClose = () => {
    setShowModal(false);
  };
  const showSwal = (
    errorTitle: string,
    errorMessage: string,
    status: number
  ) => {
    withReactContent(Swal).fire({
      icon: status == 200 ? "success" : "error",
      title: errorTitle,
      text: errorMessage,
    });
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
          showSwal("Buy Success", data.message, 200);
        } else {
          console.error("Failed to buy boat:", data.message);
          showSwal("Failed to buy boat", data.message, 400);
        }
      } catch (error) {
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
