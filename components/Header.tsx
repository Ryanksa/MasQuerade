import React from "react";
import MasquerText from "./MasquerText";
import { useRouter } from "next/router";

function Header() {
  const router = useRouter();

  const goToHome = () => {
    router.push("/");
  };

  const goToSignup = () => {
    router.push("/signup");
  };

  const goToLogin = () => {
    router.push("/login");
  };

  return (
    <div className="w-full flex justify-between py-12 px-8 overflow-hidden relative">
      <div className="cursor-pointer" onClick={goToHome}>
        <MasquerText
          text="MasQuerADe"
          flipIndices={[3, 8]}
          leftFontSize={80}
          fontStepSize={0}
          transform="rotate(-10deg)"
          transformOrigin=""
          hoverInvert={false}
          hoverBackdrop={false}
        />
      </div>

      <div className="w-32 h-32 rounded-full bg-red-500 absolute -right-20"></div>
      <div
        className="absolute top-8 right-4 cursor-pointer"
        onClick={goToSignup}
      >
        <MasquerText
          text="SignUp"
          flipIndices={[4]}
          leftFontSize={48}
          fontStepSize={-4}
          transform="rotate(8deg)"
          transformOrigin="right 50%"
          hoverInvert={true}
          hoverBackdrop={false}
        />
      </div>
      <div
        className="absolute top-24 right-4 cursor-pointer"
        onClick={goToLogin}
      >
        <MasquerText
          text="LogIn"
          flipIndices={[1]}
          leftFontSize={48}
          fontStepSize={-4}
          transform="rotate(-15deg)"
          transformOrigin="right 50%"
          hoverInvert={true}
          hoverBackdrop={false}
        />
      </div>
    </div>
  );
}

export default Header;
