import { ReactNode } from "react";
import Head from "next/head";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Background from "./Background";
import Transition from "./Transition";

type Props = {
  children: ReactNode;
  title: string;
  minimal?: boolean;
};

function AuthenticatedLayout(props: Props) {
  return (
    <>
      <Head>
        <title>{props.title}</title>
      </Head>
      {!props.minimal && (
        <>
          <Background />
          <Header signedIn={true} />
          <Sidebar />
        </>
      )}
      {props.children}
      <Transition />
    </>
  );
}

export default AuthenticatedLayout;
