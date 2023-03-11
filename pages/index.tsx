import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { getServerSidePropsAuth } from "../lib/utils/auth";
import { generateRandomString } from "../lib/utils/general";
import UnauthenticatedLayout from "../components/UnauthenticatedLayout";
import MasquerText from "../components/MasquerText";
import Phone from "../components/Phone";
import ChatMessage from "../components/ChatMessage";
import { ChatMessage as ChatMessageType } from "../lib/models/chat";

const DEMO_ROOM_ID = generateRandomString(32);
const DEMO_USERNAME = generateRandomString(32);
const MY_USERNAME = generateRandomString(32);

const Home: NextPage = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMessages([
      {
        id: generateRandomString(32),
        username: DEMO_USERNAME,
        name: "Rewn",
        roomId: DEMO_ROOM_ID,
        content:
          "Welcome to Masquerade, a chat app themed after the game Persona 5.",
        postedOn: new Date().toISOString(),
      },
      {
        id: generateRandomString(32),
        username: DEMO_USERNAME,
        name: "Rewn",
        roomId: DEMO_ROOM_ID,
        content: "Hi there!",
        postedOn: new Date().toISOString(),
      },
    ]);
  }, []);

  const handleSend = () => {
    setMessages((prevMessages) => [
      {
        id: generateRandomString(32),
        username: MY_USERNAME,
        name: "Me",
        roomId: DEMO_ROOM_ID,
        room: "Demo",
        content: message,
        postedOn: new Date().toISOString(),
      },
      ...prevMessages,
    ]);
    setMessage("");
  };

  return (
    <UnauthenticatedLayout>
      <div className="absolute top-0 left-0 w-full sm:relative">
        <div className="hidden sm:block absolute left-1/2 -top-6 z-10">
          <MasquerText
            text="PreVieW"
            flipIndices={[1, 3]}
            leftFontSize={72}
            fontStepSize={-4}
            transform="rotate(12deg)"
            transformOrigin=""
            hoverInvert={false}
            transitionIn={true}
          />
        </div>
        <Phone enterAnimation={false}>
          <div className="relative w-full h-full overflow-hidden flex flex-col overflow-anchor-none">
            <div className="w-full h-full pb-8 flex flex-col-reverse overflow-scroll scrollbar-hidden">
              {messages.map((msg) => (
                <div key={msg.id} className="mt-8">
                  <ChatMessage
                    message={msg}
                    received={msg.username === DEMO_USERNAME}
                    enterAnimation={true}
                  />
                </div>
              ))}
            </div>
            <div className="w-full flex items-center p-[8px]">
              <input
                type="text"
                className="w-[calc(100%-90px)] text-[24px] p-[4px] border-[3px] border-neutral-900 rounded-[5px]"
                placeholder="Send a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
              />
              <div
                className="cursor-pointer absolute right-2"
                onClick={handleSend}
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
          </div>
        </Phone>
      </div>
    </UnauthenticatedLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsAuth(context, {
    ifUnauth: false,
    ifAuth: true,
    url: "/home",
  });
};

export default Home;
