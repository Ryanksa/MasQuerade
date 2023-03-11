import styles from "../styles/Sidebar.module.css";
import MasquerText from "./MasquerText";
import { FaTheaterMasks } from "react-icons/fa";
import { useRouterWithTransition } from "../lib/hooks/router";
import { signOut } from "../lib/services/auth";

function Sidebar() {
  const router = useRouterWithTransition();

  const handleLogout = () => {
    return signOut().then(() => {
      router.push("/");
    });
  };

  return (
    <div className="fixed -bottom-12 left-1/2 z-50">
      <div
        className={`
          absolute -bottom-40 -left-28 w-56 h-56 rounded-full 
          flex justify-center items-center group
          ${styles.container}
        `}
      >
        <FaTheaterMasks
          size="10rem"
          color="#ffffff"
          className="transition-all group-hover:-rotate-[354deg]"
        />
        <div
          className={`
            absolute left-0 top-0 w-full h-full rounded-full overflow-hidden 
            ${styles.optionsContainer}
          `}
        >
          <div
            className={`
              absolute -left-48 -top-16 cursor-pointer origin-right
              ${styles.option} ${styles.home}
            `}
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
              transitionIn={false}
            />
          </div>
          <div
            className={`
              absolute -right-64 -top-20 cursor-pointer origin-left 
              ${styles.option} ${styles.chats}
            `}
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
              transitionIn={false}
            />
          </div>
          <div
            className={`
              absolute -left-60 top-36 cursor-pointer origin-right 
              ${styles.option} ${styles.profile}
            `}
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
              transitionIn={false}
            />
          </div>
          <div
            className={`
              absolute -right-64 top-32 cursor-pointer origin-left
              ${styles.option} ${styles.logout}
            `}
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
              transitionIn={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
