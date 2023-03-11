import { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { getServerSidePropsAuth } from "../../lib/utils/auth";
import AuthenticatedLayout from "../../components/AuthenticatedLayout";
import { ChatRoom } from "../../lib/models/chat";
import prisma from "../../lib/utils/prisma";
import MasquerText from "../../components/MasquerText";
import { IoAddCircle } from "react-icons/io5";
import { BsExclamationLg } from "react-icons/bs";
import {
  getChatRooms,
  createChatRoom,
  subscribeNewChatRooms,
  unsubscribeNewChatRooms,
} from "../../lib/services/chatroom";
import { useRouterWithTransition } from "../../lib/hooks/router";
import { Operation } from "../../lib/models/listener";

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
  const router = useRouterWithTransition();

  useEffect(() => {
    subscribeNewChatRooms((event) => {
      switch (event.operation) {
        case Operation.Add:
          if (page === 0)
            setChatRooms((prevRooms) => [event.data, ...prevRooms.slice(0, 9)]);
          break;
        default:
          break;
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
      const rooms = res.data ?? [];
      if (res.hasMore) {
        setIsLastPage(false);
      } else {
        setIsLastPage(true);
      }
      setChatRooms(rooms.slice(0, PAGE_SIZE));
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
            transitionIn={true}
          />
        </div>
        <div className="absolute top-0 right-0 z-10 flex flex-col">
          {!newRoomInput && (
            <IoAddCircle
              onClick={() => setNewRoomInput(true)}
              size="4rem"
              className="absolute -top-2 -left-16 cursor-pointer fill-neutral-800 hover:fill-neutral-700"
            />
          )}
          {newRoomInput && (
            <div
              className={`
                absolute -bottom-52 right-0 w-96 h-48 flex flex-col justify-center py-2 px-14 skew-y-3 skew-x-6 bg-gray-50
                before:absolute before:left-8 before:top-6 before:-z-10 before:w-80 before:h-36 before:bg-neutral-900 before:-skew-x-6 before:-skew-y-3
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
                    transitionIn={false}
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
                    transitionIn={false}
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
              transitionIn={false}
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
              transitionIn={false}
            />
          </div>
        )}

        <div className="text-3xl w-full text-gray-50 bg-neutral-900 overflow-hidden skew-x-1 skew-y-2 animate-expandMenu">
          {chatRooms.map((room, idx) => (
            <div
              key={idx}
              className="w-fit mx-auto cursor-pointer relative before:absolute before:top-[15%] before:left-1/2 hover:before:-left-[45px] before:w-0 hover:before:w-[calc(100%+90px)] before:h-3/4 before:bg-neutral-700 before:transition-all before:-z-10 before:scale-0 hover:before:scale-100 hover:before:rotate-6 hover:before:-skew-x-2 hover:before:-skew-y-3 hover:before:animate-wiggleOption"
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

      const rooms = await prisma.chatRoom.findMany({
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
      });

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
    }
  );
};

export default Chats;
