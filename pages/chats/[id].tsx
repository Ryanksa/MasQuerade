import { useState, useEffect, useRef } from "react";
import { GetServerSideProps } from "next";
import { getServerSidePropsAuth } from "../../lib/utils/auth";
import { useRouterWithTransition } from "../../lib/hooks/router";
import MasquerText from "../../components/MasquerText";
import ChatMessage from "../../components/ChatMessage";
import Phone from "../../components/Phone";
import RoomSettings from "../../components/RoomSettings";
import AuthenticatedLayout from "../../components/AuthenticatedLayout";
import prisma from "../../lib/utils/prisma";
import {
  ChatMessage as ChatMessageType,
  ChatRoom as ChatRoomType,
} from "../../lib/models/chat";
import { Member as MemberType } from "../../lib/models/user";
import { Event, Operation } from "../../lib/models/listener";
import {
  getChatMessages,
  sendChatMessage,
  subscribeNewChatMessages,
  unsubscribeNewChatMessages,
} from "../../lib/services/chatmessage";
import {
  updateLastActive,
  addRoomMember,
  deleteRoomMember,
  subscribeNewRoomMember,
  unsubscribeNewRoomMember,
  updateChatRoom,
  deleteChatRoom,
} from "../../lib/services/chatroom";
import { BsFillPeopleFill } from "react-icons/bs";
import { updateRoomIncludes } from "../../lib/caches/roomIncludes";
import { generateRandomString } from "../../lib/utils/general";

const PAGE_SIZE = 10;

type Props = {
  data: {
    messages: ChatMessageType[];
    room: ChatRoomType;
    members: MemberType[];
  };
  username: string;
};

function Chat(props: Props) {
  const { data, username } = props;

  const router = useRouterWithTransition();
  const roomId = String(router.query.id);

  const [roomName, setRoomName] = useState(data.room.room);
  const [members, setMembers] = useState<MemberType[]>(data.members);
  const [messages, setMessages] = useState<ChatMessageType[]>(data.messages);
  const [localMessages, setLocalMessages] = useState<ChatMessageType[]>([]);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(0);
  const [inSettings, setInSettings] = useState(false);

  const oldestRef = useRef<HTMLDivElement>(null);
  const newestRef = useRef<HTMLDivElement>(null);
  const membership = props.data.members.find(
    (m) => m.username === props.username
  );

  useEffect(() => {
    subscribeNewChatMessages((event: Event<ChatMessageType>) => {
      switch (event.operation) {
        case Operation.Add:
          setLocalMessages((prev) => {
            const lastMsg = prev.length > 0 ? prev[prev.length - 1] : null;
            if (
              lastMsg &&
              lastMsg.content === event.data.content &&
              lastMsg.username === event.data.username
            ) {
              return [...prev.slice(0, -1)];
            }
            return prev;
          });
          setMessages((prevMsgs) => [event.data, ...prevMsgs]);
          break;
        default:
          break;
      }
    });
    return unsubscribeNewChatMessages;
  }, []);

  useEffect(() => {
    subscribeNewRoomMember((event) => {
      switch (event.operation) {
        case Operation.Add:
          setMembers((prevMembers) => [...prevMembers, event.data]);
          break;
        case Operation.Delete:
          setMembers((prevMembers) =>
            prevMembers.filter((m) => m.username !== event.data.username)
          );
          break;
        default:
          break;
      }
    });
    return unsubscribeNewRoomMember;
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === oldestRef.current && entry.isIntersecting) {
          handleGetMoreMessages();
        }
        if (entry.target === newestRef.current && entry.isIntersecting) {
          updateLastActive(roomId);
        }
      });
    });

    let oldestMessage: HTMLDivElement | null = null;
    if (oldestRef.current) {
      oldestMessage = oldestRef.current;
      observer.observe(oldestMessage);
    }

    let newestMessage: HTMLDivElement | null = null;
    if (newestRef.current) {
      newestMessage = newestRef.current;
      observer.observe(newestMessage);
    }

    return () => {
      if (oldestMessage) observer.unobserve(oldestMessage);
      if (newestMessage) observer.unobserve(newestMessage);
    };
  }, [messages]);

  const handleGetMoreMessages = () => {
    getChatMessages(roomId, page + 1, PAGE_SIZE).then((res) => {
      const chatMessages = res.data ?? [];
      if (chatMessages.length > 0) {
        setMessages((prevMsgs) => {
          const lut = prevMsgs.reduce<{ [id: string]: ChatMessageType }>(
            (map, m) => {
              map[m.id] = m;
              return map;
            },
            {}
          );
          return [...prevMsgs, ...chatMessages.filter((m) => !lut[m.id])];
        });
        setPage((prevPage) => prevPage + 1);
      }
    });
  };

  const handleSend = () => {
    sendChatMessage(roomId, message);
    setLocalMessages((prev) => [
      {
        id: generateRandomString(32),
        username: username,
        name: "",
        roomId: roomId,
        content: message,
        postedOn: new Date().toISOString(),
      },
      ...prev,
    ]);
    setMessage("");
  };

  const handleAddMember = (username: string, moderator: boolean) => {
    addRoomMember(roomId, username, moderator);
  };

  const handleDeleteMember = (username: string) => {
    deleteRoomMember(roomId, username).then(() => {
      if (username === props.username) {
        router.push("/chats");
      }
    });
  };

  const handleUpdateRoom = (roomName: string) => {
    updateChatRoom(roomId, roomName);
    setRoomName(roomName);
  };

  const handleDeleteRoom = () => {
    deleteChatRoom(roomId).then(() => {
      router.push("/chats");
    });
  };

  return (
    <AuthenticatedLayout title={roomName} minimal={true}>
      <div className="sm:p-8 sm:min-h-screen sm:grid sm:items-center">
        <Phone enterAnimation={true}>
          <div className="relative w-full h-full overflow-hidden flex flex-col overflow-anchor-none">
            <div className="w-full h-[32px] bg-red-600 bg-opacity-50 border-neutral-900 flex px-4 py-[4px] truncate">
              <div
                className="cursor-pointer text-neutral-900 text-[18px] flex gap-2"
                onClick={() => setInSettings(true)}
              >
                <BsFillPeopleFill size={24} />
                {roomName}
              </div>
            </div>
            <div className="w-full h-[calc(100%-66px-32px)] pb-8 flex flex-col-reverse overflow-scroll scrollbar-hidden">
              {localMessages.map((msg) => (
                <div key={msg.id} className="mt-8">
                  <ChatMessage
                    message={msg}
                    received={false}
                    enterAnimation={false}
                  />
                </div>
              ))}
              {messages.map((msg, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === messages.length - 1;
                return (
                  <div
                    key={msg.id}
                    className="mt-8"
                    ref={isFirst ? newestRef : isLast ? oldestRef : null}
                  >
                    <ChatMessage
                      message={msg}
                      received={msg.username !== username}
                      enterAnimation={isFirst}
                    />
                  </div>
                );
              })}
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
            {inSettings && (
              <RoomSettings
                roomName={roomName}
                members={members}
                membership={membership}
                onClose={() => setInSettings(false)}
                onUpdateRoom={handleUpdateRoom}
                onDeleteRoom={handleDeleteRoom}
                onAddMember={handleAddMember}
                onDeleteMember={handleDeleteMember}
              />
            )}
          </div>
        </Phone>
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
      const roomId = String(context.params?.id);
      const userId = context.req.cookies.id ?? "";
      const username = context.req.cookies.username ?? "";
      const defaultRoom: ChatRoomType = {
        id: "",
        room: "",
        lastActive: "",
        seenLatest: false,
      };

      const roomIncludes = await prisma.roomIncludes.findMany({
        where: { roomId: roomId },
        select: {
          id: true,
          roomId: true,
          userId: true,
          moderator: true,
          lastActive: true,
          user: true,
        },
      });
      if (!roomIncludes.find((include) => include.userId === userId)) {
        return {
          props: {
            data: {
              messages: [],
              room: defaultRoom,
              members: [],
            },
            username: username,
          },
        };
      }

      updateRoomIncludes(roomId, roomIncludes);

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
        take: PAGE_SIZE,
      });

      const chatRoom = await prisma.chatRoom.findUnique({
        where: { id: roomId },
      });
      const room = chatRoom
        ? ({
            id: chatRoom.id,
            room: chatRoom.name,
            lastActive: chatRoom.lastActive.toISOString(),
            seenLatest: true,
          } as ChatRoomType)
        : defaultRoom;

      return {
        props: {
          data: {
            messages: chatMessages.map((msg) => ({
              id: msg.id,
              username: msg.user.username,
              name: msg.user.name,
              roomId: msg.room.id,
              room: msg.room.name,
              content: msg.content,
              postedOn: msg.postedOn.toISOString(),
            })),
            room: room,
            members: roomIncludes
              .map((include) => ({
                username: include.user.username,
                name: include.user.name,
                socialStats: include.user.socialStats,
                moderator: include.moderator,
              }))
              .reverse(),
          },
          username: username,
        },
      };
    }
  );
};

export default Chat;
