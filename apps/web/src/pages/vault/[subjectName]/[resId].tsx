import Head from "next/head";
import React from "react";
import NavBar from "../../../components/nav-bar";
import { trpc } from "../../../utils/trpc";
import { useRouter } from "next/router";
import LoadingDisplay from "../../../components/common/loading-display";
import VaultResourceViewer from "../../../components/vault/vault-resource-viewer";

export default function ResourceView() {
  const { subjectName, resId } = useRouter().query;

  const resourceQuery = trpc.useQuery([
    "vault.resourceViewer.resourceView",
    { resId: resId as string },
  ]);

  if (resourceQuery.isLoading)
    return (
      <>
        <Head>
          <title>{`Resource view - Access`}</title>
          <meta name="description" content={"Resource viewer"} />
          <link rel="icon" href="/icons/favicon.ico" />
        </Head>
        <NavBar />
        <div className="container mx-auto p-6">
          <LoadingDisplay />
        </div>
      </>
    );

  const resource = resourceQuery.data;

  if (!resource)
    return (
      <>
        <Head>
          <title>{`Resource view - Access`}</title>
          <meta name="description" content={"Resource viewer"} />
          <link rel="icon" href="/icons/favicon.ico" />
        </Head>
        <NavBar />
        <div className="container mx-auto p-6">
          <h1 className={"text-2xl font-mono font-semibold"}>
            404 No resource found
          </h1>
        </div>
      </>
    );

  return (
    <VaultResourceViewer
      subjectName={subjectName as string}
      resource={resource}
    />
  );
}
