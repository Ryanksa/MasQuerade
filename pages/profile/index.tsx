import React from "react";
import { GetServerSideProps } from "next";
import { getServerSidePropsAuth } from "../../utils/auth";
import AuthenticatedLayout from "../../layouts/AuthenticatedLayout";

function Profile() {
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

export default Profile;
