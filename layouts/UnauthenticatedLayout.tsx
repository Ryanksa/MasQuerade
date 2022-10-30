import { ReactNode } from "react";
import Header from "../components/Header";
import Background from "../components/Background";
import Transition from "../components/Transition";

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
