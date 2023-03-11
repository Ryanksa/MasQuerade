import { ReactNode } from "react";
import Header from "./Header";
import Background from "./Background";
import Transition from "./Transition";

type Props = {
  children: ReactNode;
};

function UnauthenticatedLayout(props: Props) {
  return (
    <>
      <Background />
      <Header signedIn={false} />
      {props.children}
      <Transition />
    </>
  );
}

export default UnauthenticatedLayout;
