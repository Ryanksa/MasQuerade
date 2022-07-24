import React from "react";
import styles from "../styles/Sidebar.module.css";
import MasquerText from "./MasquerText";
import { FaTheaterMasks } from "react-icons/fa";
import { useRouter } from "next/router";
import { signOut } from "../services/auth";

function Sidebar() {
  const router = useRouter();

  const handleLogout = () => {
    return signOut().then(() => {
      router.push("/");
    });
  };

  return (
    <div className={styles.anchor}>
      <div className={styles.container}>
        <FaTheaterMasks size="10rem" color="#ffffff" />

        <div className={styles.optionsContainer}>
          <div
            className={`${styles.option} ${styles.home}`}
            onClick={() => router.push("/home")}
          >
            <MasquerText
              text="HoMe"
              flipIndices={[]}
              leftFontSize={81}
              fontStepSize={-15}
              transform="rotate(2deg)"
              transformOrigin="right 100%"
              hoverInvert={true}
            />
          </div>
          <div
            className={`${styles.option} ${styles.chats}`}
            onClick={() => router.push("/chats")}
          >
            <MasquerText
              text="CHats"
              flipIndices={[2]}
              leftFontSize={36}
              fontStepSize={18}
              transform="rotate(-10deg)"
              transformOrigin="left 100%"
              hoverInvert={true}
            />
          </div>
          <div
            className={`${styles.option} ${styles.profile}`}
            onClick={() => router.push("/profile")}
          >
            <MasquerText
              text="ProFile"
              flipIndices={[0, 3]}
              leftFontSize={56}
              fontStepSize={-4}
              transform="rotate(-20deg)"
              transformOrigin="right 100%"
              hoverInvert={true}
            />
          </div>
          <div
            className={`${styles.option} ${styles.logout}`}
            onClick={handleLogout}
          >
            <MasquerText
              text="LogOut"
              flipIndices={[3]}
              leftFontSize={32}
              fontStepSize={10}
              transform="rotate(15deg)"
              transformOrigin="left 100%"
              hoverInvert={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
