import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { MouseEventHandler } from "react";
import { LabeledFormControl } from "../components/common/labeled-form-control";
import NavBar from "../components/nav-bar";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

export default function Login() {
  const { data, status } = useSession();

  if (status == "authenticated")
    return (
      <div className={"text-center"}>
        <NavBar />

        <p className={"pt-12"}>
          You are already signed in as [{data.user?.email}]
        </p>
        <div className="flex mt-4 justify-center gap-2">
          <Link href={"/"}>
            <a className={"btn btn-outline"}>Go home</a>
          </Link>
          <a className={"btn btn-outline"} onClick={() => signOut()}>
            Sign out
          </a>
        </div>
      </div>
    );

  return (
    <div>
      <NavBar />
      <div className="rounded p-10 w-full md:w-112 mx-auto">
        <div className="flex flex-col gap-4">
          <h3 className={"font-semibold font-mono text-lg"}>Login with</h3>
          {/* <LabeledFormControl label={"Email"}>
            <label className="input-group">
              <span>
                <EnvelopeIcon className={"w-5"} />
              </span>
              <input
                type="email"
                className={"input input-bordered w-full"}
                placeholder={"Email..."}
              />
            </label>
          </LabeledFormControl>
          <button className="btn">Continue</button>
          <div>
            Not a member?{" "}
            <Link href={"/signup"}>
              <a className={"link link-secondary"}>Sign up here</a>
            </Link>
          </div>

          <div className="divider" />

          <h3 className="font-semibold font-mono">Or with</h3> */}
          <div className="flex gap-2">
            <SocialButton
              svgPath={"/icons/google-logo.svg"}
              alt={"Google"}
              text={"Google"}
              onClick={() => signIn("google", { callbackUrl: "/" })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export interface SocialButtonProps {
  svgPath: string;
  alt: string;
  text: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function SocialButton({
  svgPath,
  alt,
  text,
  onClick,
}: SocialButtonProps) {
  return (
    <button
      className={"btn btn-outline border-gray-300 flex-1"}
      onClick={onClick}
    >
      <div className="w-5 h-5 relative mr-2">
        <Image src={svgPath} alt={alt} layout={"fill"} objectFit={"contain"} />
      </div>
      <span className="normal-case">{text}</span>
    </button>
  );
}
