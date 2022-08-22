import React from "react";
import { GetServerSideProps } from "next";
import { getServerSidePropsAuth } from "../../utils/auth";
import AuthenticatedLayout from "../../layouts/AuthenticatedLayout";
import prisma from "../../utils/prisma";
import { User } from "../../models/user";
import MasquerText from "../../components/MasquerText";

type Props = {
  data: {
    user: User;
  };
};

function Profile(props: Props) {
  const { user } = props.data;
  return (
    <AuthenticatedLayout>
      <div className="relative px-8 w-full h-[42rem]">
        <div className="absolute left-[30%] top-0">
          <div className="absolute left-0 top-0 w-48 z-10">
            <MasquerText
              text="Name"
              flipIndices={[]}
              leftFontSize={54}
              fontStepSize={0}
              transform=""
              transformOrigin=""
              hoverInvert={false}
            />
          </div>
          <h2 className="absolute left-24 top-14 text-2xl w-max bg-neutral-200 p-4 rotate-6 before:absolute before:left-2 before:top-2 before:w-full before:h-full before:bg-neutral-50 before:rotate-6 before:-z-10">
            {user.name}
          </h2>
        </div>
        <div className="absolute left-[60%] top-48">
          <div className="absolute left-0 top-0 w-64 z-10">
            <MasquerText
              text="UsErNamE"
              flipIndices={[2, 4]}
              leftFontSize={54}
              fontStepSize={0}
              transform=""
              transformOrigin=""
              hoverInvert={false}
            />
          </div>
          <h2 className="absolute -right-8 top-14 text-2xl w-max bg-neutral-200 p-4 -rotate-6 before:absolute before:left-2 before:top-2 before:w-full before:h-full before:bg-neutral-50 before:-rotate-6 before:-z-10">
            {user.username}
          </h2>
        </div>
        <div className="absolute left-[30%] top-96">
          <div className="absolute left-0 top-0 w-96 z-10 flex gap-8">
            <MasquerText
              text="SocIal"
              flipIndices={[3]}
              leftFontSize={54}
              fontStepSize={0}
              transform=""
              transformOrigin=""
              hoverInvert={false}
            />
            <MasquerText
              text="StatS"
              flipIndices={[0]}
              leftFontSize={54}
              fontStepSize={0}
              transform=""
              transformOrigin=""
              hoverInvert={false}
            />
          </div>
          <div className="absolute left-24 top-14 w-max bg-neutral-200 p-2 rotate-6 before:absolute before:left-2 before:top-2 before:w-full before:h-full before:bg-neutral-50 before:rotate-6 before:-z-10">
            <MasquerText
              text={String(user.socialStats.toFixed(2))}
              flipIndices={[]}
              leftFontSize={36}
              fontStepSize={0}
              transform=""
              transformOrigin=""
              hoverInvert={false}
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
