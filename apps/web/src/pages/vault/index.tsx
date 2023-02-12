import Head from "next/head";
import React from "react";

import NavBar from "../../components/nav-bar";
import SubjectGraph from "../../components/subject-graph-wrapper";
import { useElementResize } from "../../hooks/element-resize";
import getAuthServerSideProps from "../../server/common/get-auth-server-side-props";

export default function Vault() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const containerSize = useElementResize(containerRef);

  return (
    <>
      <Head>
        <title>{`Resource vault - Access`}</title>
        <link rel="icon" href="/icons/favicon.ico" />
      </Head>
      <main className={"w-screen h-screen flex flex-col"}>
        <NavBar />
        <div className={"relative flex-1 w-full"}>
          <div ref={containerRef} className="absolute w-full h-full" />
          <div className="absolute w-full h-full overflow-hidden">
            <SubjectGraph
              width={containerSize.width - 1}
              height={containerSize.height - 1}
            />
          </div>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps = getAuthServerSideProps();
