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
      <div className="relative py-4 px-24 grid grid-cols-2 gap-y-8 items-center">
        <MasquerText
          text="Name"
          flipIndices={[]}
          leftFontSize={54}
          fontStepSize={0}
          transform=""
          transformOrigin=""
          hoverInvert={false}
        />
        <h2 className="text-2xl">{user.name}</h2>
        <MasquerText
          text="UsErNamE"
          flipIndices={[2, 4]}
          leftFontSize={54}
          fontStepSize={0}
          transform=""
          transformOrigin=""
          hoverInvert={false}
        />
        <h2 className="text-2xl">{user.username}</h2>
        <div className="flex gap-8">
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
