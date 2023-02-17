import React from "react";

export interface LoadingDisplayProps {
  text?: string;
}

export default function LoadingDisplay(props: LoadingDisplayProps) {
  return (
    <div className={"flex flex-col justify-center"}>
      <p className={"text-center font-mono font-semibold"}>
        {props.text ?? "Loading"}
      </p>
      <button className="btn btn-ghost h-16 before:w-10 before:h-10 loading" />
    </div>
  );
}
