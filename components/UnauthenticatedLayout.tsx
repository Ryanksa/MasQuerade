import { ReactNode } from "react";
import Header from "./Header";
import Background from "./Background";
import Transition from "./Transition";
import Head from "next/head";

type Props = {
  children: ReactNode;
  title: string;
};

function UnauthenticatedLayout(props: Props) {
  return (
    <>
      <Head>
        <title>{props.title}</title>
      </Head>
      <Background />
      <Header signedIn={false} />
      {props.children}
      <Transition />
    </>
  );
}

export default UnauthenticatedLayout;
