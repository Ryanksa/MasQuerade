import { useState } from "react";
import MasquerText from "./MasquerText";

type Props = {
  onSendMessage: (message: string) => void;
};

function ChatInput(props: Props) {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    props.onSendMessage(message);
    setMessage("");
  };

  return (
    <div className="w-full flex items-center p-[8px]">
      <input
        type="text"
        className="w-[calc(100%-90px)] text-[24px] p-[4px] border-[3px] border-neutral-900 rounded-[5px]"
        placeholder="Send a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSendMessage();
        }}
      />
      <div
        className="cursor-pointer absolute right-2"
        onClick={handleSendMessage}
      >
        <MasquerText
          text="Send"
          flipIndices={[]}
          leftFontSize={42}
          fontStepSize={0}
          transform="rotate(-8deg)"
          transformOrigin=""
          hoverInvert={true}
          transitionIn={false}
        />
      </div>
    </div>
  );
}

export default ChatInput;
