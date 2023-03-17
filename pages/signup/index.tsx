import { useState } from "react";
import { GetServerSideProps } from "next";
import { getServerSidePropsAuth } from "../../lib/utils/auth";
import UnauthenticatedLayout from "../../components/UnauthenticatedLayout";
import MasquerText from "../../components/MasquerText";
import { signUp } from "../../lib/services/auth";
import { useRouterWithTransition } from "../../lib/hooks/router";
import { AiOutlineLoading } from "react-icons/ai";

function Signup() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouterWithTransition();

  const handleSignUp = () => {
    setIsLoading(true);
    return signUp(name, username, password)
      .then(() => {
        router.push("/login");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <UnauthenticatedLayout title="Sign Up">
      <div className="relative max-w-md text-xl font-extrabold mx-auto mt-12 p-4 rounded border-t-8 border-r-8 border-b-2 border-l-2 border-red-100 bg-red-400 skew-x-1 skew-y-3 animate-slideDown">
        <div className="absolute -top-8 right-1/2 sm:-right-16">
          <MasquerText
            text="SignUp"
            flipIndices={[4]}
            leftFontSize={60}
            fontStepSize={-3}
            transform="rotate(9deg)"
            transformOrigin=""
            hoverInvert={false}
            transitionIn={true}
          />
        </div>
        <div className="mb-4 mx-auto w-11/12">
          <label htmlFor="signup-name">Name</label>
          <input
            type="text"
            id="signup-name"
            className="block w-full text-l font-normal rounded border-2 border-gray-300"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4 mx-auto w-11/12">
          <label htmlFor="signup-username">Username</label>
          <input
            type="text"
            id="signup-username"
            className="block w-full text-l font-normal rounded border-2 border-gray-300"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-4 mx-auto w-11/12">
          <label htmlFor="signup-password">Password</label>
          <input
            type="password"
            id="signup-password"
            className="block w-full text-l font-normal rounded border-2 border-gray-300"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className="flex justify-center items-center gap-2 w-24 h-11 m-auto bg-rose-600 rounded p-2 text-gray-100 enabled:hover:bg-rose-500 enabled:active:bg-rose-700 disabled:opacity-50"
          onClick={handleSignUp}
          disabled={isLoading}
        >
          {isLoading ? (
            <AiOutlineLoading className="animate-spin" />
          ) : (
            <>Sign Up</>
          )}
        </button>
      </div>
    </UnauthenticatedLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsAuth(context, {
    ifUnauth: false,
    ifAuth: true,
    url: "/home",
  });
};

export default Signup;
