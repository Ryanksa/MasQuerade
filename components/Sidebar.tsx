import React from "react";
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
    <div className="fixed -bottom-12 left-1/2 z-50">
      <div className="absolute -bottom-40 -left-28 bg-red-500 w-56 h-56 rounded-full flex justify-center items-center transition-all group hover:bottom-12">
        <FaTheaterMasks size="10rem" color="#ffffff" />

        <div className="absolute left-0 top-0 w-full h-full rounded-full overflow-hidden group-hover:animate-sidebar-option-overflow">
          <div
            className="absolute -left-48 -top-16 rotate-y-35 cursor-pointer origin-right group-hover:animate-sidebar-option-home"
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
            className="absolute -right-64 -top-20 rotate-y-35 cursor-pointer origin-left group-hover:animate-sidebar-option-chats"
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
            className="absolute -left-60 top-36 rotate-y-25 cursor-pointer origin-right group-hover:animate-sidebar-option-profile"
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
            className="absolute -right-64 top-32 rotate-y-35 cursor-pointer origin-left group-hover:animate-sidebar-option-logout"
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
