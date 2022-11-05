import NavBar from "../../components/nav-bar";
import Head from "next/head";
import React from "react";
import ResourceCard from "../../components/subject/resource-card";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import LoadingDisplay from "../../components/common/loading-display";
import getAuthServerSideProps from "../../server/common/get-auth-server-side-props";

export default function SubjectBoard() {
  const { subjectName } = useRouter().query;
  const { isLoading, data: subjectView } = trpc.useQuery([
    "vault.subjectView",
    subjectName as string,
  ]);

  return (
    <>
      <Head>
        <title>{`${
          subjectView?.subject.name ?? "Subject view"
        } - Access`}</title>
        <link rel="icon" href="/icons/favicon.ico" />
      </Head>
      <NavBar />
      <main className={"container mt-4 mx-auto px-4"}>
        {isLoading || !subjectView ? (
          <LoadingDisplay />
        ) : (
          <>
            <div className={"py-4"}>
              <h1 className={"font-bold text-3xl font-mono "}>
                {subjectView.subject.name}
              </h1>
              <p>{subjectView.subject.about}</p>
            </div>

            <div className="grid grid-flow-col grid-cols-4 gap-2">
              {resourceCards()}
            </div>
          </>
        )}
      </main>
    </>
  );

  function resourceCards() {
    if (!subjectView) return;
    return Object.values(subjectView.resources).map((r) => (
      <ResourceCard
        key={r.id + "-card"}
        subjectName={subjectView.subject.name}
        resource={r}
      />
    ));
  }
}

export const getServerSideProps = getAuthServerSideProps();
