import React, { useState } from "react";
import { GetServerSideProps } from "next";
import { getServerSidePropsAuth } from "../../lib/auth";
import AuthenticatedLayout from "../../layouts/AuthenticatedLayout";
import { ChatRoom } from "../../models/chat";
import prisma from "../../lib/prisma";
import MasquerText from "../../components/MasquerText";
import { IoAddCircle } from "react-icons/io5";
import { createChatRoom } from "../../services/chat";

type Props = {
  data: ChatRoom[];
};

function Chats(props: Props) {
  const { data } = props;
  const [newRoomInput, setNewRoomInput] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");

  return (
    <AuthenticatedLayout>
      <div className="relative w-1/2 min-w-[20ch] mx-auto mt-4 pt-8 pr-6 pb-10 pl-10 bg-gray-50 -skew-x-3 -skew-y-6">
        <div className="absolute -bottom-8 -left-20 z-10">
          <MasquerText
            text="ChatS"
            flipIndices={[0, 1, 2]}
            leftFontSize={108}
            fontStepSize={-12}
            transform="rotate(10deg)"
            transformOrigin=""
            hoverInvert={false}
          />
        </div>
        <div className="absolute top-0 right-0 z-10 flex flex-col">
          {!newRoomInput && (
            <IoAddCircle
              onClick={() => setNewRoomInput(true)}
              size="4rem"
              className="absolute -left-16 cursor-pointer fill-stone-700 hover:fill-stone-600"
            />
          )}
          {newRoomInput && (
            <div className="absolute -bottom-4 -right-12 w-96 h-48 flex flex-col justify-center py-2 px-14 skew-y-3 skew-x-6 bg-gray-50 before:absolute before:left-8 before:top-6 before:-z-10 before:w-80 before:h-36 before:bg-stone-700 before:-skew-x-6 before:-skew-y-3">
              <input
                type="text"
                placeholder="Name of chat room"
                className="block my-3 mx-auto w-11/12 text-2xl rounded-md py-1 px-2 border-2 border-stone-800"
                value={newRoomName}
                onChange={(event) => setNewRoomName(event.target.value)}
              />
              <div className="flex justify-between gap-4">
                <div className="cursor-pointer">
                  <MasquerText
                    text="ConFirm"
                    flipIndices={[]}
                    leftFontSize={32}
                    fontStepSize={0}
                    transform=""
                    transformOrigin=""
                    hoverInvert={true}
                  />
                </div>
                <div
                  onClick={() => setNewRoomInput(false)}
                  className="cursor-pointer"
                >
                  <MasquerText
                    text="Cancel"
                    flipIndices={[]}
                    leftFontSize={32}
                    fontStepSize={0}
                    transform=""
                    transformOrigin=""
                    hoverInvert={true}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="text-3xl w-full min-h-[8rem] text-gray-50 bg-neutral-700 overflow-hidden skew-x-1 skew-y-2">
          {data.map((room, idx) => (
            <div
              key={idx}
              className="w-full cursor-pointer font-semibold text-center p-2 relative before:absolute before:top-[15%] before:left-[10%] before:w-4/5 before:h-3/4 before:bg-neutral-800 before:transition-all before:scale-0 before:-z-10 hover:before:scale-100 hover:before:rotate-6 hover:before:-skew-x-2 hover:before:-skew-y-3 hover:before:animate-chat-room-wiggle"
            >
              {room.room}
            </div>
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
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
      const userId = context.req.cookies.id ?? "";
      return prisma.chatRoom
        .findMany({
          select: { id: true, name: true, lastActive: true, includes: true },
          where: {
            includes: {
              some: { userId: userId },
            },
          },
          orderBy: {
            lastActive: "desc",
          },
          skip: 0,
          take: 10,
        })
        .then((rooms) => {
          return {
            props: {
              data: rooms.map((room) => {
                const userRoomIncludes = room.includes.filter(
                  (i) => i.userId === userId
                )[0];
                return {
                  id: room.id,
                  room: room.name,
                  lastActive: room.lastActive.toISOString(),
                  seenLatest: userRoomIncludes.lastActive >= room.lastActive,
                };
              }),
            },
          };
        });
    }
  );
};

export default Chats;
