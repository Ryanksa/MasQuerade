import React, { useState } from "react";
import MasquerText from "../../components/MasquerText";
import UnauthenticatedLayout from "../../layouts/UnauthenticatedLayout";
import { signIn } from "../../services/auth";
import { useRouter } from "next/router";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignIn = () => {
    signIn(username, password).then(() => {
      router.push("/home");
    });
  };

  return (
    <UnauthenticatedLayout>
      <div className="relative max-w-md text-xl font-extrabold mx-auto p-4 rounded border-t-8 border-r-8 border-b-2 border-l-2 border-red-100 bg-red-400 skew-x-1 skew-y-3">
        <div className="absolute -top-8 -right-16">
          <MasquerText
            text="LogIn"
            flipIndices={[1]}
            leftFontSize={60}
            fontStepSize={-3}
            transform="rotate(9deg)"
            transformOrigin=""
            hoverBackdrop={false}
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
        <button
          className="block w-fit m-auto bg-rose-600 rounded p-2 text-gray-100 hover:bg-rose-500"
          onClick={handleSignIn}
        >
          Log In
        </button>
      </div>
    </UnauthenticatedLayout>
  );
}

export default Login;
