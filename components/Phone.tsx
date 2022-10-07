import React from "react";
import styles from "../styles/Phone.module.css";

type Props = {
  children: React.ReactNode;
  enterAnimation?: boolean;
};

function Phone(props: Props) {
  return (
    <div
      className={`
        w-full sm:w-[480px] h-screen sm:h-[810px] bg-red-500 m-auto sm:rounded-md 
        border-y-0 border-x-0 sm:border-y-[30px] sm:border-x-[11px] sm:border-gray-100 
        ${styles.shell} ${props.enterAnimation ? styles.enterAnimation : ""}
      `}
    >
      <div className="w-full h-full overflow-hidden border-0 sm:border-[5px] sm:border-neutral-900">
        {props.children}
      </div>
    </div>
  );
}

export default Phone;
