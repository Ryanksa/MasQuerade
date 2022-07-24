import React from "react";
import { GetServerSideProps } from "next";
import { getServerSidePropsAuth } from "../../utils/auth";
import AuthenticatedLayout from "../../layouts/AuthenticatedLayout";
import { useRouter } from "next/router";

function Chat() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <AuthenticatedLayout>
      <></>
    </AuthenticatedLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsAuth(context, {
    ifUnauth: true,
    ifAuth: false,
    url: "/login",
  });
};

export default Chat;
