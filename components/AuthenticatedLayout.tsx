import { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Background from "./Background";
import Transition from "./Transition";

type Props = {
  children: ReactNode;
};

function AuthenticatedLayout(props: Props) {
  return (
    <>
      <Background />
      <Header signedIn={true} />
      <Sidebar />
      {props.children}
      <Transition />
    </>
  );
}

export default AuthenticatedLayout;
