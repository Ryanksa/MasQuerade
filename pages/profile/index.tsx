import { GetServerSideProps } from "next";
import { getServerSidePropsAuth } from "../../lib/utils/auth";
import AuthenticatedLayout from "../../components/AuthenticatedLayout";
import prisma from "../../lib/utils/prisma";
import { User } from "../../lib/models/user";
import MasquerText from "../../components/MasquerText";
import { FaUser } from "react-icons/fa";

type Props = {
  data: {
    user: User;
  };
};

function Profile(props: Props) {
  const { user } = props.data;
  return (
    <AuthenticatedLayout title="Profile">
      <div className="relative w-full h-[27rem]">
        <FaUser className="absolute left-[5%] top-[2.5%] w-[90%] h-[90%] text-neutral-50 -rotate-3" />
        <FaUser className="absolute left-[5%] top-[10%] w-[85%] h-[85%] text-neutral-900 -rotate-6" />
        <div className="absolute left-1/2 top-0">
          <div className="absolute left-0 top-0 w-48 z-10">
            <MasquerText
              text="Name"
              flipIndices={[]}
              leftFontSize={54}
              fontStepSize={0}
              transform=""
              transformOrigin=""
              hoverInvert={false}
              transitionIn={true}
            />
          </div>
          <h2 className="absolute left-24 top-14 text-2xl w-max bg-neutral-200 p-4 rotate-6 before:absolute before:left-2 before:top-2 before:w-full before:h-full before:bg-neutral-50 before:rotate-6 before:-z-10 before:animate-slideOffCard">
            {user.name}
          </h2>
        </div>
        <div className="absolute left-1/2 top-1/3">
          <div className="absolute left-0 top-0 w-64 z-10">
            <MasquerText
              text="UsErNamE"
              flipIndices={[2, 4]}
              leftFontSize={54}
              fontStepSize={0}
              transform=""
              transformOrigin=""
              hoverInvert={false}
              transitionIn={true}
            />
          </div>
          <h2 className="absolute left-24 top-14 text-2xl w-max bg-neutral-200 p-4 rotate-6 before:absolute before:left-2 before:top-2 before:w-full before:h-full before:bg-neutral-50 before:rotate-6 before:-z-10 before:animate-slideOffCard">
            {user.username}
          </h2>
        </div>
        <div className="absolute left-1/2 top-2/3">
          <div className="absolute left-0 top-0 w-96 z-10 flex gap-8">
            <MasquerText
              text="SocIal"
              flipIndices={[3]}
              leftFontSize={54}
              fontStepSize={0}
              transform=""
              transformOrigin=""
              hoverInvert={false}
              transitionIn={true}
            />
            <MasquerText
              text="StatS"
              flipIndices={[0]}
              leftFontSize={54}
              fontStepSize={0}
              transform=""
              transformOrigin=""
              hoverInvert={false}
              transitionIn={true}
            />
          </div>
          <div className="absolute left-24 top-14 w-max p-2 rotate-6 ">
            <MasquerText
              text={String(user.socialStats.toFixed(2))}
              flipIndices={[]}
              leftFontSize={36}
              fontStepSize={0}
              transform=""
              transformOrigin=""
              hoverInvert={false}
              transitionIn={false}
            />
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
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      return {
        props: {
          data: {
            user: {
              username: user!.username,
              name: user!.name,
              socialStats: user!.socialStats,
            },
          },
        },
      };
    }
  );
};

export default Profile;
