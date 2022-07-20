import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

type Props = {
  children: React.ReactNode;
};

function AuthenticatedLayout(props: Props) {
  return (
    <>
      <Header signedIn={true} />
      <Sidebar />
      {props.children}
    </>
  );
}

export default AuthenticatedLayout;
