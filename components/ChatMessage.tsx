import { useMemo } from "react";
import styles from "../styles/ChatMessage.module.css";
import { ChatMessage as ChatMessageType } from "../lib/models/chat";
import { FaUser } from "react-icons/fa";
import { BsFillTrashFill } from "react-icons/bs";
import { getMessagePolygon, getNumberOfLines } from "../lib/utils/message";
import { useAnimatedMessage } from "../lib/hooks/message";
import { animated } from "@react-spring/web";

const CHARS_PER_LINE = 27;
const REC_CHARS_PER_LINE = 24;
const BASE_HEIGHT = 50;
const LINE_HEIGHT = 27;

type Props = {
  message: ChatMessageType;
  received: boolean;
  enterAnimation?: boolean;
  onDelete?: (messageId: string) => void;
};

function ChatMessage(props: Props) {
  const { message, received, enterAnimation, onDelete } = props;
  const lines = getNumberOfLines(
    message.content,
    received ? REC_CHARS_PER_LINE : CHARS_PER_LINE
  );
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

  const messagePolygons = useMemo(
    () => [
      getMessagePolygon(received, height, 0, 0),
      getMessagePolygon(received, height, 4.5, 3),
      getMessagePolygon(received, height, 4.5, 3),
    ],
    [received, height]
  );
  const animatedPolygon = useAnimatedMessage(messagePolygons, 300);

  return (
    <div
      style={{ height: BASE_HEIGHT + height }}
      className={`
        flex items-start mb-8 relative
        ${received ? "left-[-18px] sm:left-0" : ""}
      `}
    >
      {received && (
        <div
          className={`
            absolute top-[36px] h-[60px] w-[84px] bg-white flex items-end justify-center
            border-neutral-800 border-top-[4px] border-r-[2px] border-b-[8px] border-l-[10px] 
            ${styles.messager}
          `}
        >
          <FaUser
            className={`absolute left-[9px] bottom-[13px] w-[42px] h-[42px] text-neutral-700 ${styles.messagerIcon}`}
          />
          <FaUser
            className={`absolute left-[11px] bottom-[12px] w-[42px] h-[42px] text-neutral-800 ${styles.messagerIcon}`}
          />
          <div
            className={`
              absolute left-0 bottom-0 w-full flex justify-center
              text-[16px] text-white pb-[5px] whitespace-nowrap
              ${styles.messagerName}
            `}
          >
            {message.name}
          </div>
        </div>
      )}
      <div
        className={`absolute w-full h-full group 
          ${enterAnimation ? styles.enter : ""}
          ${
            received
              ? "left-[54px] top-[-9px] origin-[-30px_40px]"
              : "origin-[100%_30px]"
          }
        `}
      >
        <div
          className={`
            absolute top-[20px] transition-all flex items-center gap-1
            ${
              received
                ? "left-[60px] rotate-[-1deg] group-hover:top-[-21px] group-active:top-[-21px]"
                : "right-[35px] rotate-[-2deg] group-hover:top-[-21px] group-active:top-[-21px]"
            }
          `}
        >
          <div className="py-[1px] px-[8px] w-max bg-neutral-50 text-neutral-800 font-black rounded-t-[3px]">
            {postedDate}&nbsp;&nbsp;&nbsp;{postedTime}
          </div>
          {onDelete && (
            <BsFillTrashFill
              className="text-neutral-800 hover:text-neutral-50 cursor-pointer"
              onClick={() => onDelete(message.id)}
            />
          )}
        </div>
        <svg
          width="350"
          height={BASE_HEIGHT + height}
          className={`absolute ${received ? "left-0" : "right-0"}`}
        >
          <animated.polygon
            className="fill-gray-50"
            points={animatedPolygon.outer}
          />
          <animated.polygon
            className="fill-neutral-800"
            points={animatedPolygon.inner}
          />
        </svg>
        <div
          className={`
            absolute text-white text-[20px] overflow-scroll scrollbar-hidden
            ${
              received
                ? "w-[252px] left-[60px] top-[15px]"
                : "w-[264px] right-[45px] top-[18px]"
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
