import React from "react";
import Header from "../components/Header";

type Props = {
  children: React.ReactNode;
};

function UnauthenticatedLayout(props: Props) {
  return (
    <>
      <Header signedIn={false} />
      {props.children}
    </>
  );
}

export default UnauthenticatedLayout;
