import { ReactNode } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import BaseLayout from "./BaseLayout";

type Props = {
  children: ReactNode;
};

function AuthenticatedLayout(props: Props) {
  return (
    <>
      <BaseLayout />
      <Header signedIn={true} />
      <Sidebar />
      {props.children}
    </>
  );
}

export default AuthenticatedLayout;
