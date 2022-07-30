import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import { getServerSidePropsAuth } from "../utils/auth";
import UnauthenticatedLayout from "../layouts/UnauthenticatedLayout";

const Home: NextPage = () => {
  return (
    <UnauthenticatedLayout>
      <></>
    </UnauthenticatedLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsAuth(context, {
    ifUnauth: false,
    ifAuth: true,
    url: "/home",
  });
};

export default Home;
