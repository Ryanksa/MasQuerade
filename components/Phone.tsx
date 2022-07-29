import React from "react";
import styles from "../styles/Phone.module.css";

type Props = {
  children: React.ReactNode;
};

function Phone(props: Props) {
  return (
    <div
      className={`
        w-full sm:w-[480px] h-screen sm:h-[750px] bg-red-500 m-auto rounded-md 
        border-y-0 border-x-0 sm:border-y-[30px] sm:border-x-[11px] sm:border-gray-100 
        ${styles.shell}
      `}
    >
      <div
        className={`
          w-full h-full overflow-x-hidden overflow-y-scroll 
          border-0 sm:border-[5px] sm:border-neutral-900
          ${styles.screen}
        `}
      >
        {props.children}
      </div>
    </div>
  );
}

export default Phone;
