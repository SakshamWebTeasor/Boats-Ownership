import React from "react";
import { Button } from "react-bootstrap";

import styles from "../../styles/LoginModal.module.css";
import Link from "next/link";

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <span className={styles.close} onClick={onClose}>
          &times;
        </span>
        <div className="d-flex justify-content-center flex-column align-items-center">
          <p>Please login first to continue.</p>
          {/* Add your login form or link to the login page here */}
          <Button>
            <Link
              href={"/Login"}
              style={{ textDecoration: "none", color: "white" }}
            >
              Go to Login page
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
