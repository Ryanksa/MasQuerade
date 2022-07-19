import React from "react";
import Header from "../components/Header";

type Props = {
  children: React.ReactNode;
};

function AuthenticatedLayout(props: Props) {
  return (
    <>
      <Header signedIn={true} />
      {props.children}
    </>
  );
}

export default AuthenticatedLayout;
