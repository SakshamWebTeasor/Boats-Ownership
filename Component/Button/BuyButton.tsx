import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import LoginModal from "../Modal/LoginModal";

interface BuyButtonProps {
  ownerIds: number[];
}

function BuyButton({ ownerIds }: BuyButtonProps) {
  const loggedInUser = useSelector((state: any) => state.reducer.userLoggedIn);
  const [showModal, setShowModal] = useState(false);
  const handleLoginModalClose = () => {
    setShowModal(false);
  };
  const handleBuyButtonClick = () => {
    if (loggedInUser) {
      console.log("User is logged in. Performing buy action...");
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
