import { ReactNode } from "react";
import Header from "../components/Header";
import BaseLayout from "./BaseLayout";

type Props = {
  children: ReactNode;
};

function UnauthenticatedLayout(props: Props) {
  return (
    <>
      <BaseLayout />
      <Header signedIn={false} />
      {props.children}
    </>
  );
}

export default UnauthenticatedLayout;
