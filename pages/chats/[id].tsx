import React from "react";
import { GetServerSideProps } from "next";
import { getServerSidePropsAuth } from "../../utils/auth";
import { useRouter } from "next/router";
import MasquerText from "../../components/MasquerText";
import Phone from "../../components/Phone";
import prisma from "../../utils/prisma";
import { ChatMessage } from "../../models/chat";

type Props = {
  data: ChatMessage[];
};

function Chat(props: Props) {
  const router = useRouter();
  const { id } = router.query;
  const { data } = props;

  return (
    <div className="sm:p-8">
      <Phone>
        <></>
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

      return prisma.roomIncludes
        .findFirst({
          where: { roomId: roomId, userId: userId },
        })
        .then((includes) => {
          if (!includes) return;
          return prisma.chatMessage.findMany({
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
        })
        .then((chatMessages) => {
          if (!chatMessages) {
            return {
              props: { data: [] },
            };
          }
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
            },
          };
        });
    }
  );
};

export default Chat;
