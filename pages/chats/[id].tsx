import React, { useState, useEffect, useRef } from "react";
import { GetServerSideProps } from "next";
import { getServerSidePropsAuth } from "../../utils/auth";
import { useRouter } from "next/router";
import MasquerText from "../../components/MasquerText";
import ChatMessage from "../../components/ChatMessage";
import Phone from "../../components/Phone";
import prisma from "../../utils/prisma";
import {
  ChatMessage as ChatMessageType,
  ChatRoom as ChatRoomType,
} from "../../models/chat";
import { Member as MemberType } from "../../models/user";
import { Event, Operation } from "../../models/listener";
import {
  getChatMessages,
  sendChatMessage,
  subscribeNewChatMessages,
  unsubscribeNewChatMessages,
} from "../../services/chatmessage";
import {
  updateLastActive,
  addRoomMember,
  deleteRoomMember,
  subscribeNewRoomMember,
  unsubscribeNewRoomMember,
  updateChatRoom,
  deleteChatRoom,
} from "../../services/chatroom";
import {
  MdAddModerator,
  MdCancel,
  MdShield,
  MdCheckCircle,
} from "react-icons/md";
import {
  BsFillPeopleFill,
  BsFillPersonPlusFill,
  BsFillTrashFill,
} from "react-icons/bs";
import { IoMdAddCircle } from "react-icons/io";
import { GoSignOut } from "react-icons/go";
import { FiEdit2 } from "react-icons/fi";

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
  const router = useRouter();
  const roomId = String(router.query.id);
  const { data, username } = props;

  const [messages, setMessages] = useState<ChatMessageType[]>(data.messages);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(0);

  const [inSettings, setInSettings] = useState(false);
  const [roomName, setRoomName] = useState(data.room.room);
  const [isEditingRoom, setIsEditingRoom] = useState(false);
  const [editingRoomName, setEditingRoomName] = useState(data.room.room);
  const [members, setMembers] = useState<MemberType[]>(data.members);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [memberUsername, setMemberUsername] = useState("");

  const oldestRef = useRef<HTMLDivElement>(null);
  const newestRef = useRef<HTMLDivElement>(null);
  const membership = props.data.members.find(
    (m) => m.username === props.username
  );

  useEffect(() => {
    subscribeNewChatMessages((event: Event<ChatMessageType>) => {
      if (event.operation === Operation.Add) {
        setMessages((prevMsgs) => [event.data, ...prevMsgs]);
      }
    });
    return () => unsubscribeNewChatMessages();
  }, []);

  useEffect(() => {
    subscribeNewRoomMember((event) => {
      if (event.operation === Operation.Add) {
        setMembers((prevMembers) => [...prevMembers, event.data]);
      } else if (event.operation === Operation.Delete) {
        setMembers((prevMembers) =>
          prevMembers.filter((m) => m.username !== event.data.username)
        );
      }
    });
    return () => unsubscribeNewRoomMember();
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
    sendChatMessage(roomId, message).finally(() => {
      setMessage("");
    });
  };

  const handleAddMember = (username: string, moderator: boolean) => {
    addRoomMember(roomId, username, moderator).then(() => {
      setIsAddingMember(false);
      setMemberUsername("");
    });
  };

  const handleDeleteMember = (username: string) => {
    deleteRoomMember(roomId, username).then(() => {
      if (username === props.username) {
        router.push("/chats");
      }
    });
  };

  const handleUpdateRoom = () => {
    updateChatRoom(roomId, editingRoomName).then(() => {
      setRoomName(editingRoomName);
      setIsEditingRoom(false);
    });
  };

  const handleDeleteRoom = () => {
    deleteChatRoom(roomId).then(() => {
      router.push("/chats");
    });
  };

  return (
    <div className="sm:p-8">
      <Phone>
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
              />
            </div>
          </div>

          {inSettings && (
            <div className="absolute aspect-square rounded-br-full shadow-lg bg-red-500 animate-expand">
              <div className="w-1/2 h-1/2 p-6 text-white overflow-scroll scrollbar-hidden">
                <div
                  className="cursor-pointer mb-8"
                  onClick={() => setInSettings(false)}
                >
                  <MasquerText
                    text="<Back"
                    flipIndices={[]}
                    leftFontSize={27}
                    fontStepSize={3}
                    transform=""
                    transformOrigin=""
                    hoverInvert={true}
                  />
                </div>
                <div className="mb-2">
                  <MasquerText
                    text="RooM"
                    flipIndices={[]}
                    leftFontSize={54}
                    fontStepSize={4}
                    transform="rotate(-12deg)"
                    transformOrigin="left"
                    hoverInvert={false}
                  />
                  <div className="relative left-12 -top-6 w-[calc(100%-3rem)] text-4xl flex justify-between items-center">
                    {!isEditingRoom ? (
                      <>
                        {roomName}
                        <div className="flex gap-2">
                          <FiEdit2
                            size={24}
                            className="cursor-pointer text-neutral-900 hover:text-neutral-50"
                            onClick={() => setIsEditingRoom(true)}
                          />
                          <BsFillTrashFill
                            size={24}
                            className="cursor-pointer text-neutral-900 hover:text-neutral-50"
                            onClick={handleDeleteRoom}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <input
                          type="text"
                          placeholder="Room Name"
                          className="w-4/5 text-lg px-2 py-1 rounded-sm text-neutral-900"
                          value={editingRoomName}
                          onChange={(e) => setEditingRoomName(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <MdCheckCircle
                            size={24}
                            className="cursor-pointer text-neutral-900 hover:text-neutral-50"
                            onClick={handleUpdateRoom}
                          />
                          <MdCancel
                            size={24}
                            className="cursor-pointer text-neutral-900 hover:text-neutral-50"
                            onClick={() => setIsEditingRoom(false)}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="mb-4 ml-auto w-max">
                    <MasquerText
                      text="MemberS"
                      flipIndices={[2]}
                      leftFontSize={46}
                      fontStepSize={2}
                      transform="rotate(12deg)"
                      transformOrigin="left"
                      hoverInvert={false}
                    />
                  </div>
                  {members.map((user) => (
                    <div
                      key={user.username}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <div className="text-2xl text-neutral-50 flex items-center gap-2">
                          {user.moderator && <MdShield />}
                          {user.name}
                        </div>
                        <div className="text-neutral-200">{user.username}</div>
                      </div>
                      {(membership?.moderator ||
                        user.username === props.username) && (
                        <div className="flex gap-2">
                          <GoSignOut
                            size={24}
                            className="cursor-pointer text-neutral-900 hover:text-neutral-50"
                            onClick={() => handleDeleteMember(user.username)}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  {membership?.moderator && (
                    <>
                      {isAddingMember ? (
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            placeholder="username"
                            className="text-lg w-3/4 px-2 py-1 rounded-sm text-neutral-900"
                            value={memberUsername}
                            onChange={(e) => setMemberUsername(e.target.value)}
                          />
                          <div className="flex items-center gap-2">
                            <MdAddModerator
                              size={24}
                              className="cursor-pointer text-neutral-900 hover:text-neutral-50"
                              onClick={() =>
                                handleAddMember(memberUsername, true)
                              }
                            />
                            <BsFillPersonPlusFill
                              size={24}
                              className="cursor-pointer text-neutral-900 hover:text-neutral-50"
                              onClick={() =>
                                handleAddMember(memberUsername, false)
                              }
                            />
                            <MdCancel
                              size={24}
                              className="cursor-pointer text-neutral-900 hover:text-neutral-50"
                              onClick={() => setIsAddingMember(false)}
                            />
                          </div>
                        </div>
                      ) : (
                        <IoMdAddCircle
                          size={48}
                          className="m-auto cursor-pointer text-neutral-900 hover:text-neutral-50"
                          onClick={() => setIsAddingMember(true)}
                        />
                      )}
                    </>
                  )}
                </div>
                <div></div>
              </div>
            </div>
          )}
        </div>
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
      const defaultRoom: ChatRoomType = {
        id: "",
        room: "",
        lastActive: "",
        seenLatest: false,
      };

      const includes = await prisma.roomIncludes.findMany({
        where: { roomId: roomId },
        select: { userId: true, user: true, moderator: true },
      });
      if (!includes.find((i) => i.userId === userId)) {
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
            members: includes
              .map((i) => ({
                username: i.user.username,
                name: i.user.name,
                socialStats: i.user.socialStats,
                moderator: i.moderator,
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
