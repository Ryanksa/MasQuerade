import React from "react";
import MasquerText from "./MasquerText";
import { FaTheaterMasks } from "react-icons/fa";
import { useRouter } from "next/router";
import { signOut } from "../services/auth";

function Sidebar() {
  const router = useRouter();

  const handleLogout = () => {
    signOut().then(() => {
      router.push("/");
    });
  };

  return (
    <div className="fixed -bottom-12 left-1/2">
      <div className="absolute -bottom-32 -left-36 hover:bottom-12 bg-red-500 w-52 h-52 rounded-full flex justify-center items-center transition-all">
        <FaTheaterMasks size="10rem" color="#ffffff" />
        <div
          className="absolute -left-24 -top-8 cursor-pointer"
          style={{ transform: "rotateY(35deg)" }}
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
          className="absolute -right-32 -top-12 cursor-pointer"
          style={{ transform: "rotateY(35deg)" }}
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
          className="absolute -left-20 top-24 cursor-pointer"
          style={{ transform: "rotateY(25deg)" }}
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
          className="absolute -right-32 top-16 cursor-pointer"
          style={{ transform: "rotateY(35deg)" }}
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
  );
}

export default Sidebar;
