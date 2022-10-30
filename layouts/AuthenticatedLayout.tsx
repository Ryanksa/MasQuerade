import { ReactNode } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Background from "../components/Background";
import Transition from "../components/Transition";

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
