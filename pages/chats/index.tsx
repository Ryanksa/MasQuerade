import React, { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { getServerSidePropsAuth } from "../../utils/auth";
import AuthenticatedLayout from "../../layouts/AuthenticatedLayout";
import { ChatRoom } from "../../models/chat";
import prisma from "../../utils/prisma";
import MasquerText from "../../components/MasquerText";
import { IoAddCircle } from "react-icons/io5";
import { BsExclamationLg } from "react-icons/bs";
import {
  getChatRooms,
  createChatRoom,
  subscribeNewChatRooms,
  unsubscribeNewChatRooms,
} from "../../services/chat";
import { useRouter } from "next/router";

type Props = {
  data: ChatRoom[];
  hasMore: boolean;
};

const PAGE_SIZE = 10;

function Chats(props: Props) {
  const { data, hasMore } = props;
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>(data);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(!hasMore);
  const [newRoomInput, setNewRoomInput] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const router = useRouter();

  useEffect(() => {
    subscribeNewChatRooms((room) => {
      if (page === 0) {
        setChatRooms((prevRooms) => [room, ...prevRooms.slice(0, 9)]);
      }
    });
    return () => {
      unsubscribeNewChatRooms();
    };
  }, [page]);

  const handleCreateChatRoom = () => {
    if (newRoomName === "") return;
    return createChatRoom(newRoomName).finally(() => {
      setNewRoomInput(false);
      setNewRoomName("");
    });
  };

  const handlePageChange = (page: number) => {
    return getChatRooms(page, PAGE_SIZE).then((res) => {
      if (res.hasMore) {
        setIsLastPage(false);
      } else {
        setIsLastPage(true);
      }
      setChatRooms(res.data.slice(0, PAGE_SIZE));
      setPage(page);
    });
  };

  const handleNextPage = () => {
    if (isLastPage) return;
    handlePageChange(page + 1);
  };

  const handlePrevPage = () => {
    if (page === 0) return;
    handlePageChange(page - 1);
  };

  return (
    <AuthenticatedLayout>
      <div className="relative w-full md:w-1/2 mx-auto mt-4 pt-8 pr-6 pb-10 pl-10 bg-gray-50 -skew-x-3 -skew-y-6">
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
              className="absolute -top-2 -left-16 cursor-pointer fill-stone-700 hover:fill-stone-600"
            />
          )}
          {newRoomInput && (
            <div
              className={`
                absolute -bottom-52 right-0 sm:-bottom-4 sm:-right-12 w-96 h-48 flex flex-col justify-center py-2 px-14 skew-y-3 skew-x-6 bg-gray-50
                before:absolute before:left-8 before:top-6 before:-z-10 before:w-80 before:h-36 before:bg-neutral-700 before:-skew-x-6 before:-skew-y-3
              `}
            >
              <input
                type="text"
                placeholder="Name of chat room"
                className="block my-3 mx-auto w-11/12 text-2xl rounded-md py-1 px-2 border-2 border-neutral-800"
                value={newRoomName}
                onChange={(event) => setNewRoomName(event.target.value)}
              />
              <div className="flex justify-between gap-4">
                <div className="cursor-pointer" onClick={handleCreateChatRoom}>
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
                  className="cursor-pointer"
                  onClick={() => {
                    setNewRoomInput(false);
                    setNewRoomName("");
                  }}
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
        {!isLastPage && (
          <div
            className="absolute top-1/3 right-0 cursor-pointer z-10"
            onClick={handleNextPage}
          >
            <MasquerText
              text=">"
              flipIndices={[]}
              leftFontSize={108}
              fontStepSize={0}
              transform=""
              transformOrigin=""
              hoverInvert={true}
            />
          </div>
        )}
        {page > 0 && (
          <div
            className="absolute top-1/3 left-0 cursor-pointer z-10"
            onClick={handlePrevPage}
          >
            <MasquerText
              text="<"
              flipIndices={[]}
              leftFontSize={108}
              fontStepSize={0}
              transform=""
              transformOrigin=""
              hoverInvert={true}
            />
          </div>
        )}

        <div className="text-3xl w-full min-h-[8rem] text-gray-50 bg-neutral-700 overflow-hidden skew-x-1 skew-y-2">
          {chatRooms.map((room, idx) => (
            <div
              key={idx}
              className="w-full cursor-pointer relative before:absolute before:top-[15%] before:left-[10%] before:w-4/5 before:h-3/4 before:bg-neutral-800 before:transition-all before:scale-0 before:-z-10 hover:before:scale-100 hover:before:rotate-6 hover:before:-skew-x-2 hover:before:-skew-y-3 hover:before:animate-wiggle"
              onClick={() => router.push(`/chats/${room.id}`)}
            >
              <div className="relative w-fit font-semibold m-auto p-2">
                {room.room}
                {room.seenLatest === false && (
                  <BsExclamationLg
                    size="2rem"
                    className="absolute -right-4 top-0 fill-red-500 rotate-6"
                  />
                )}
              </div>
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
          take: 11,
        })
        .then((rooms) => {
          return {
            props: {
              data: rooms.slice(0, 10).map((room) => {
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
              hasMore: rooms.length > 10,
            },
          };
        });
    }
  );
};

export default Chats;
