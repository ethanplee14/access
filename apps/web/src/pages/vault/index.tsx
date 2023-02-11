import Head from "next/head";
import React, { useState } from "react";

import LoadingDisplay from "../../components/common/loading-display";
import NavBar from "../../components/nav-bar";
import SubjectGraph from "../../components/subject-graph-wrapper";
import { useElementResize } from "../../hooks/element-resize";
import getAuthServerSideProps from "../../server/common/get-auth-server-side-props";
import { trpc } from "../../utils/trpc";

export default function Vault() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const containerSize = useElementResize(containerRef);

  const { data: subjectData } = trpc.useQuery(["vault.subjectGraph"]);
  const [searchedSubject, setSearchedSubject] = useState("");

  const sortedSubjectNames =
    subjectData != undefined
      ? Object.values(subjectData)
          .map((s) => s.name)
          .sort((s1, s2) => (s1 < s2 ? -1 : 1))
      : [];

  return (
    <>
      <Head>
        <title>{`Resource vault - Access`}</title>
        <link rel="icon" href="/icons/favicon.ico" />
      </Head>
      <main className={"w-screen h-screen flex flex-col"}>
        <NavBar subjects={sortedSubjectNames} onSearch={setSearchedSubject} />
        <div className={"relative flex-1 w-full"}>
          <div ref={containerRef} className="absolute w-full h-full" />
          <div className="absolute w-full h-full overflow-hidden">
            {subjectData == undefined && (
              <div className={"mt-24"}>
                <LoadingDisplay />
              </div>
            )}
            <SubjectGraph
              width={containerSize.width - 1}
              height={containerSize.height - 1}
              subjectData={subjectData}
              subjectFocus={searchedSubject}
            />
          </div>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps = getAuthServerSideProps();
