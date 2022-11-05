import Head from "next/head";
import NavBar from "../components/nav-bar";
import React from "react";

export default function Home() {
  return (
    <>
      <Head>
        <title>Access</title>
        <meta name="description" content="Knowledge Graph" />
        <link rel="icon" href="icons/favicon.ico" />
      </Head>
      <main className={"w-screen h-screen flex flex-col"}>
        <NavBar />
        <div className={"flex-1 w-full bg-base-100"}></div>
      </main>
    </>
  );
}

export function getServerSideProps() {
  return {
    redirect: {
      destination: "/vault",
    },
  };
}
