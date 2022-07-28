import React from "react";
import styles from "../styles/ChatMessage.module.css";
import { ChatMessage as ChatMessageType } from "../models/chat";
import { FaUser } from "react-icons/fa";
import { getNumberOfLines } from "../utils/general";

const CHARS_PER_LINE = 30;
const BASE_HEIGHT = 50;
const LINE_HEIGHT = 25;

type Props = {
  message: ChatMessageType;
  received: boolean;
  enterAnimation?: boolean;
};

function ChatMessage(props: Props) {
  const { message, received, enterAnimation } = props;
  const lines = getNumberOfLines(message.content, CHARS_PER_LINE);
  const height = lines * LINE_HEIGHT;
  const postedOnDate = new Date(message.postedOn);
  const postedDate = postedOnDate.toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  let postedTime = postedOnDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const outerPolygon = received
    ? // prettier-ignore
      `5,55 25,38 35,42 45,35 48,5 350,0 340,${40+height} 40,${35+height} 43,55 35,57 25,52`
    : // prettier-ignore
      `350,40 340,23 330,30 322,24 325,0 0,10 0,${35+height} 315,${40+height} 318,45 328 48 341,36`;
  const innerPolygon = received
    ? // prettier-ignore
      `5,55 25,40 35,45 50,35 52,10 340,5 335,${35+height} 47,${30+height} 48,50 35,55 25,50`
    : // prettier-ignore
      `350,40 340,25 330,33 318,24 320,5 5,15 9,${30+height} 312,${35+height} 315,40 328,45 341,35`;

  return (
    <div className="flex items-start" style={{ height: BASE_HEIGHT + height }}>
      {received && (
        <div
          className={`
            relative top-[30px] h-[60px] w-[100px] bg-white flex items-end justify-center
            border-neutral-800 border-top-[4px] border-r-[2px] border-b-[8px] border-l-[10px] 
            ${styles.messager}
          `}
        >
          <FaUser
            className={`absolute left-[7px] bottom-[13px] w-[45px] h-[45px] text-neutral-800 ${styles.messagerIcon}`}
          />
          <FaUser
            className={`absolute left-[9px] bottom-[12px] w-[45px] h-[45px] text-neutral-700 ${styles.messagerIcon}`}
          />
          <div
            className={`
              absolute left-0 bottom-0 w-full flex justify-center
              text-[16px] text-white pb-[5px] 
              ${styles.messagerName}
            `}
          >
            {message.name}
          </div>
        </div>
      )}

      <div
        className={`
          relative w-full ${enterAnimation ? styles.enter : ""} 
          ${received ? "origin-[-30px_40px]" : "origin-[100%_30px]"}
        `}
      >
        <div
          className={`
            absolute top-[10px] py-[1px] px-[8px] bg-neutral-50 
            text-neutral-800 font-black rounded-t-[3px] transition-all
            ${
              received
                ? "left-[30px] hover:top-[-15px]"
                : "right-[35px] rotate-[-2deg] hover:top-[-18px]"
            }
          `}
        >
          {postedDate}&nbsp;&nbsp;&nbsp;{postedTime}
        </div>

        <svg
          width="350"
          height={BASE_HEIGHT + height}
          className={`absolute ${received ? "left-[-30px]" : "right-0"}`}
        >
          <polygon className="fill-gray-50" points={outerPolygon} />
          <polygon className="fill-neutral-800" points={innerPolygon} />
        </svg>

        <div
          className={`
            absolute top-[15px] text-white text-[20px] overflow-scroll
            ${styles.messageContent}
            ${
              received
                ? "w-[270px] left-[30px]"
                : "w-[280px] left-[130px] top-[20px]"
            }
          `}
          style={{ height: BASE_HEIGHT + height - 40 }}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;
