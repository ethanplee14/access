import React from "react";

export default function LoadingDisplay() {
  return (
    <div className={"flex flex-col justify-center"}>
      <p className={"text-center font-mono font-semibold"}>Loading</p>
      <button className="btn btn-ghost h-16 before:w-10 before:h-10 loading" />
    </div>
  );
}
