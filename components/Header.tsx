import MasquerText from "./MasquerText";
import { useRouterWithTransition } from "../lib/hooks/router";
import { FaTheaterMasks } from "react-icons/fa";
import { getToday } from "../lib/utils/date";

type Props = {
  signedIn: boolean;
};

function Header(props: Props) {
  const router = useRouterWithTransition();
  const today = getToday();

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
    <div className="w-full flex justify-between flex-row-reverse sm:flex-row py-12 pl-8 relative z-50">
      <div
        className="relative cursor-pointer hidden sm:block"
        onClick={goToHome}
      >
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
          transitionIn={false}
        />
      </div>
      {props.signedIn ? (
        <div className="hidden md:flex flex-col mr-8 items-end">
          <MasquerText
            text={`${today.month}/${today.day}`}
            flipIndices={[2]}
            leftFontSize={45}
            fontStepSize={0}
            transform=""
            transformOrigin=""
            hoverInvert={false}
            transitionIn={false}
          />
          <div className="relative -top-6">
            <MasquerText
              text={today.day_of_week}
              flipIndices={[0, 1, 2]}
              leftFontSize={36}
              fontStepSize={-3}
              transform="rotate(-24deg)"
              transformOrigin=""
              hoverInvert={false}
              transitionIn={false}
            />
          </div>
        </div>
      ) : (
        <div className="w-12 h-24 rounded-tl-full rounded-bl-full bg-red-500 relative">
          <div
            className="absolute -top-6 right-4 cursor-pointer w-max"
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
              transitionIn={false}
            />
          </div>
          <div
            className="absolute top-6 right-4 cursor-pointer w-max"
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
              transitionIn={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
