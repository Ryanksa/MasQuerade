import React from "react";
import AuthenticatedLayout from "../../layouts/AuthenticatedLayout";
import { GetServerSideProps } from "next";
import { isAuthenticatedCookie } from "../../middleware/auth";

type Props = {
  signedIn: boolean;
};

function Home(props: Props) {
  return (
    <AuthenticatedLayout>
      <></>
    </AuthenticatedLayout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  return {
    props: {
      signedIn: isAuthenticatedCookie(context.req.cookies),
    },
  };
};

export default Home;
