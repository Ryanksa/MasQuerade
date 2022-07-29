import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { GetServerSideProps } from "next";
import { getServerSidePropsAuth } from "../../utils/auth";
import { useRouter } from "next/router";
import MasquerText from "../../components/MasquerText";
import ChatMessage from "../../components/ChatMessage";
import Phone from "../../components/Phone";
import prisma from "../../utils/prisma";
import { ChatMessage as ChatMessageType } from "../../models/chat";
import {
  getChatMessages,
  sendChatMessage,
  subscribeNewChatMessages,
  unsubscribeNewChatMessages,
  updateLastActive,
} from "../../services/chat";

const PAGE_SIZE = 10;

type Props = {
  data: ChatMessageType[];
  username: string;
};

function Chat(props: Props) {
  const router = useRouter();
  const roomId = String(router.query.id);
  const { data, username } = props;
  const [messages, setMessages] = useState<ChatMessageType[]>(data);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(0);
  const oldestRef = useRef<HTMLDivElement>(null);
  const newestRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    subscribeNewChatMessages((chatMessage) => {
      setMessages((prevMsgs) => [chatMessage, ...prevMsgs]);
    });
    return () => unsubscribeNewChatMessages();
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
      const chatMessages = res.data as ChatMessageType[];
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

  return (
    <div className="sm:p-8">
      <Phone>
        <div className="w-full flex items-center p-[8px] overflow-visible relative">
          <input
            type="text"
            className="w-10/12 text-[24px] p-[4px] border-[3px] border-neutral-900 rounded-[5px]"
            placeholder="Send a message!"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <div className="cursor-pointer absolute right-0" onClick={handleSend}>
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
        <div className="w-full h-[calc(100% - 66px)] pb-8 flex flex-col-reverse overflow-scroll scrollbar-hidden">
          {messages.map((msg, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === messages.length - 1;
            return (
              <div
                key={idx}
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
        take: PAGE_SIZE,
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
