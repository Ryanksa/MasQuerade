import React from "react";
import MasquerText from "./MasquerText";
import { useRouter } from "next/router";
import { FaTheaterMasks } from "react-icons/fa";

type Props = {
  signedIn: boolean;
};

function Header(props: Props) {
  const router = useRouter();

  const goToHome = () => {
    if (props.signedIn) {
      router.push("/home");
    } else {
      router.push("/");
    }
  };

  const goToSignup = () => {
    router.push("/signup");
  };

  const goToLogin = () => {
    router.push("/login");
  };

  return (
    <div className="w-full flex justify-between py-12 px-8 overflow-hidden relative">
      <div className="relative cursor-pointer" onClick={goToHome}>
        <FaTheaterMasks
          size="8rem"
          color="#ffffff"
          className="absolute left-4 -top-12"
        />
        <MasquerText
          text="MasQuerADe"
          flipIndices={[3, 8]}
          leftFontSize={80}
          fontStepSize={0}
          transform="rotate(-10deg)"
          transformOrigin=""
          hoverInvert={false}
        />
      </div>

      {!props.signedIn && (
        <>
          <div className="w-24 h-24 rounded-full bg-red-500 absolute -right-14"></div>
          <div
            className="absolute top-6 right-4 cursor-pointer"
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
            />
          </div>
          <div
            className="absolute top-20 right-4 cursor-pointer"
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
            />
          </div>
        </>
      )}
    </div>
  );
}

export default Header;
