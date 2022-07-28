import React, { useState } from "react";
import { GetServerSideProps } from "next";
import { getServerSidePropsAuth } from "../../utils/auth";
import { useRouter } from "next/router";
import MasquerText from "../../components/MasquerText";
import ChatMessage from "../../components/ChatMessage";
import Phone from "../../components/Phone";
import prisma from "../../utils/prisma";
import { ChatMessage as ChatMessageType } from "../../models/chat";

type Props = {
  data: ChatMessageType[];
  username: string;
};

function Chat(props: Props) {
  const router = useRouter();
  const { id } = router.query;
  const { data, username } = props;
  const [msg, setMsg] = useState("");

  const handleSend = () => {};

  return (
    <div className="sm:p-8">
      <Phone>
        <div className="w-full p-[5px] flex items-center">
          <input
            type="text"
            className="w-3/4 text-[24px] p-[4px] border-[3px] border-neutral-900 rounded-[5px]"
            placeholder="Send a message!"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={handleSend}
          />
          <div className="cursor-pointer" onClick={handleSend}>
            <MasquerText
              text="Send"
              flipIndices={[]}
              leftFontSize={42}
              fontStepSize={0}
              transform="rotate(-8deg)"
              transformOrigin=""
              hoverInvert={true}
            />
          </div>
        </div>
        {data.map((msg, idx) => (
          <div key={idx} className="mt-8">
            <ChatMessage
              message={msg}
              received={msg.username !== username}
              enterAnimation={true}
            />
          </div>
        ))}
      </Phone>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsAuth<Props>(
    context,
    {
      ifUnauth: true,
      ifAuth: false,
      url: "/login",
    },
    async (context) => {
      const roomId = String(context.params?.id);
      const userId = context.req.cookies.id ?? "";
      const username = context.req.cookies.username ?? "";

      const includes = await prisma.roomIncludes.findFirst({
        where: { roomId: roomId, userId: userId },
      });
      if (!includes) {
        return { props: { data: [], username: username } };
      }

      const chatMessages = await prisma.chatMessage.findMany({
        select: {
          id: true,
          user: true,
          room: true,
          content: true,
          postedOn: true,
        },
        where: { roomId: roomId },
        orderBy: { postedOn: "desc" },
        skip: 0,
        take: 10,
      });

      prisma.roomIncludes.updateMany({
        data: { lastActive: new Date() },
        where: { roomId: roomId, userId: userId },
      });

      return {
        props: {
          data: chatMessages.map((msg) => ({
            id: msg.id,
            username: msg.user.username,
            name: msg.user.name,
            roomId: msg.room.id,
            room: msg.room.name,
            content: msg.content,
            postedOn: msg.postedOn.toISOString(),
          })),
          username: username,
        },
      };
    }
  );
};

export default Chat;
