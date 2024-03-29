import { GetServerSideProps } from "next";
import { getServerSidePropsAuth } from "../../lib/utils/auth";
import prisma from "../../lib/utils/prisma";
import AuthenticatedLayout from "../../components/AuthenticatedLayout";
import { ChatRoom } from "../../lib/models/chat";
import { User } from "../../lib/models/user";
import MasquerText from "../../components/MasquerText";
import { BiMessageDetail } from "react-icons/bi";
import { FaUserAlt } from "react-icons/fa";
import { useRouterWithTransition } from "../../lib/hooks/router";
import { directMessageUser } from "../../lib/services/user";

type Props = {
  data: {
    rooms: ChatRoom[];
    users: User[];
  };
};

function Home(props: Props) {
  const { data } = props;
  const router = useRouterWithTransition();

  const handleDirectMessageUser = (username: string) => {
    directMessageUser(username).then((res) => {
      router.push(`/chats/${res.data?.id}`);
    });
  };

  return (
    <AuthenticatedLayout title="Home">
      <div className="flex flex-col-reverse sm:flex-row px-8 py-4 relative">
        <div className="absolute right-1/2 -top-8 z-10">
          <MasquerText
            text="HoME"
            flipIndices={[2]}
            leftFontSize={72}
            fontStepSize={-9}
            transform="rotate(12deg)"
            transformOrigin="right"
            hoverInvert={false}
            transitionIn={false}
          />
        </div>

        <div className="sm:w-1/2 h-fit pt-8 pb-6 pl-4 pr-12 bg-neutral-50 shadow-lg skew-x-6 skew-y-2 relative">
          <div className="absolute -bottom-8 left-0 z-10 flex gap-4">
            <MasquerText
              text="RecEnt"
              flipIndices={[0, 3]}
              leftFontSize={38}
              fontStepSize={0}
              transform="rotate(8deg)"
              transformOrigin="left"
              hoverInvert={false}
              transitionIn={true}
            />
            <MasquerText
              text="ChaTs"
              flipIndices={[0]}
              leftFontSize={44}
              fontStepSize={-2}
              transform="rotate(2deg)"
              transformOrigin="left"
              hoverInvert={false}
              transitionIn={true}
            />
          </div>
          <div className="bg-neutral-900 p-4 -skew-x-2 overflow-hidden animate-expandMenu">
            <div className="flex flex-col gap-3 animate-slideUp">
              {data.rooms.map((room) => (
                <div
                  key={room.id}
                  className="text-neutral-50 w-fit mx-auto text-center font-semibold text-2xl cursor-pointer relative before:absolute before:top-[15%] before:left-1/2 hover:before:-left-[45px] before:w-0 hover:before:w-[calc(100%+90px)] before:h-full before:bg-neutral-700 before:-z-10 before:transition-all before:scale-0 hover:before:scale-100 hover:before:rotate-6 hover:before:-skew-x-6 hover:before:-skew-y-3 hover:before:animate-wiggleOption"
                  onClick={() => router.push(`/chats/${room.id}`)}
                >
                  {room.room}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sm:w-1/2 h-fit pt-6 pb-12 pl-4 pr-8 bg-neutral-50 -skew-x-4 -skew-y-2 relative sm:-ml-8 sm:-mt-12">
          <div className="absolute -bottom-8 right-0 z-10 flex gap-4">
            <MasquerText
              text="DisCOver"
              flipIndices={[4, 5]}
              leftFontSize={38}
              fontStepSize={0}
              transform="rotate(-2deg)"
              transformOrigin="left"
              hoverInvert={false}
              transitionIn={true}
            />
            <MasquerText
              text="UserS"
              flipIndices={[0]}
              leftFontSize={44}
              fontStepSize={-2}
              transform="rotate(2deg)"
              transformOrigin="left"
              hoverInvert={false}
              transitionIn={true}
            />
          </div>
          <div className="bg-neutral-900 p-4 -skew-x-2 overflow-hidden animate-expandMenu">
            <div className="flex flex-col gap-6 animate-slideUp">
              {data.users.map((user) => (
                <div
                  key={user.username}
                  className="text-neutral-50 font-semibold text-2xl flex items-center justify-between px-4 sm:px-16"
                >
                  <div className="flex flex-col gap-1">
                    <h2 className="text-2xl flex items-center gap-3 animate-slideUp">
                      <FaUserAlt /> {user.name}
                    </h2>
                    <h4 className="text-sm">{user.username}</h4>
                  </div>
                  <BiMessageDetail
                    className="cursor-pointer text-4xl transition-all hover:text-neutral-200 hover:-translate-y-1"
                    onClick={() => handleDirectMessageUser(user.username)}
                  />
                </div>
              ))}
            </div>
          </div>
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
        take: 5,
      });

      let usersInSameRoom: string[] = [];
      rooms.forEach((room) => {
        const inRoom = room.includes
          .filter((include) => include.userId !== userId)
          .map((include) => include.userId);
        usersInSameRoom = [...usersInSameRoom, ...inRoom];
      });

      const users = await prisma.user.findMany({
        where: {
          id: { in: usersInSameRoom },
        },
      });

      return {
        props: {
          data: {
            rooms: rooms.map((r) => ({
              id: r.id,
              room: r.name,
              lastActive: r.lastActive.toISOString(),
            })),
            users: users,
          },
        },
      };
    }
  );
};

export default Home;
