import React, { useState } from "react";
import { GetServerSideProps } from "next";
import { getServerSidePropsAuth } from "../../utils/auth";
import UnauthenticatedLayout from "../../layouts/UnauthenticatedLayout";
import MasquerText from "../../components/MasquerText";
import { signIn } from "../../services/auth";
import { useRouter } from "next/router";
import { AiOutlineLoading } from "react-icons/ai";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = () => {
    setIsLoading(true);
    return signIn(username, password)
      .then(() => {
        router.push("/home");
      })
      .catch(() => {
        setError("Login failed. Incorrect username or password");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <UnauthenticatedLayout>
      <div className="relative max-w-md text-xl font-extrabold mx-auto mt-12 p-4 rounded border-t-8 border-r-8 border-b-2 border-l-2 border-red-100 bg-red-400 skew-x-1 skew-y-3">
        <div className="absolute -top-8 right-1/2 sm:-right-16">
          <MasquerText
            text="LogIn"
            flipIndices={[1]}
            leftFontSize={60}
            fontStepSize={-3}
            transform="rotate(9deg)"
            transformOrigin=""
            hoverInvert={false}
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
        {error !== "" && (
          <div className="w-fit mx-auto mb-4 text-red-700 text-sm">{error}</div>
        )}
        <button
          className="flex justify-center items-center gap-2 w-24 h-11 m-auto bg-rose-600 rounded p-2 text-gray-100 enabled:hover:bg-rose-500 enabled:active:bg-rose-700 disabled:opacity-50"
          onClick={handleSignIn}
          disabled={isLoading}
        >
          {isLoading ? (
            <AiOutlineLoading className="animate-spin" />
          ) : (
            <>Log In</>
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

export default Login;
