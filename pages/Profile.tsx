import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Profile.module.css";
import ApiLink from "@/Component/ApiLink";
import { useSelector, useDispatch } from "react-redux";
import Header from "@/Component/Header";
import { jwtDecode } from "jwt-decode";
import { loginSuccess } from "@/Component/redux/action";

const ProfilePage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [decoded, setDecoded] = useState<any>({});
  const user = useSelector((state: any) => state.reducer.userLoggedIn);
  const [username, setUsername] = useState(user?.name || "");
  const [imgLink, setImgLink] = useState(user?.imgLink || "");
  const [age, setAge] = useState(user?.age || 0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.token) {
      const decodedToken = jwtDecode(user.token);
      setDecoded(decodedToken);
    }
  }, [user]);

  const handleUpdateProfile = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    const updatedUserData = {
      name: username,
      imgLink: imgLink,
      age: age,
    };
    try {
      const response = await fetch(`${ApiLink}/Users/${decoded.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUserData),
      });
      if (response.ok) {
        const data = await response.json();
        dispatch(
          loginSuccess({
            ...data,
            token: user?.token,
            id: undefined,
            password: undefined,
          })
        );
        router.push("/");
      } else {
        console.error("Profile update failed:", response.statusText);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error during profile update:", error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={styles.container}>
      <Header Page="Edit Profile" PrePage="Home" />
      <h1 className="d-flex justify-content-center">Edit Profile</h1>
      <form onSubmit={handleUpdateProfile} className={styles.form}>
        <div className={styles.label + " d-flex justify-content-between"}>
          <span>Username:</span>
          <span>{user?.name}</span>
        </div>
        <div className={styles.label + " d-flex justify-content-between"}>
          <span>Image Link:</span>
          <span>{user?.imgLink}</span>
        </div>
        <div className={styles.label + " d-flex justify-content-between"}>
          <span>Age:</span>
          <span>{user?.age}</span>
        </div>
        <label className={styles.label + " d-flex justify-content-between"}>
          <span>New Username:</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
          />
        </label>
        <label className={styles.label + " d-flex justify-content-between"}>
          <span>New Image Link:</span>
          <input
            type="url"
            value={imgLink}
            onChange={(e) => setImgLink(e.target.value)}
            className={styles.input}
          />
        </label>
        <label className={styles.label + " d-flex justify-content-between"}>
          <span>New Age:</span>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value))}
            className={styles.input}
          />
        </label>
        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
