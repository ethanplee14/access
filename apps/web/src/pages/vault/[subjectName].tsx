import NavBar from "../../components/nav-bar";
import Head from "next/head";
import React, { useState } from "react";
import ResourceCard from "../../components/subject/resource-card";
import getAuthServerSideProps from "../../server/common/get-auth-server-side-props";
import {
  EllipsisVerticalIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import DeleteModal from "../../components/common/modals/delete-modal";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import EditSubjectModal from "../../components/vault/edit-subject.modal";
import LoadingDisplay from "../../components/common/loading-display";

export default function VaultBoard() {
  const router = useRouter();
  const subjectName = router.query.subjectName as string;
  const { isLoading, data: subjectView } = trpc.useQuery([
    "vault.subject.fullView",
    subjectName,
  ]);
  const deleteMutation = trpc.useMutation("vault.subject.delete");
  const [editSubjectModalOpen, setSubjectModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  return (
    <>
      <Head>
        <title>{`${subjectName} - Access`}</title>
        <link rel="icon" href="/icons/favicon.ico" />
      </Head>
      <NavBar />
      <main className={"container mt-4 mx-auto px-4"}>
        {isLoading || !subjectView ? (
          <div className={"mt-24"}>
            <LoadingDisplay />
          </div>
        ) : (
          <>
            <div className={"py-4"}>
              <div className="dropdown dropdown-end float-right">
                <label tabIndex={0} className="btn btn-sm btn-ghost btn-circle">
                  <EllipsisVerticalIcon className={"w-5"} />
                </label>
                <ul
                  tabIndex={0}
                  className={
                    "dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                  }
                >
                  <li onClick={() => setSubjectModalOpen(true)}>
                    <a>
                      <PencilSquareIcon className={"w-5"} /> Edit
                    </a>
                  </li>
                  <li onClick={() => setDeleteModalOpen(true)}>
                    <a className={"hover:bg-error"}>
                      <TrashIcon className={"w-5"} /> Delete
                    </a>
                  </li>
                </ul>
              </div>
              <h1 className={"font-bold text-3xl font-mono"}>
                {subjectView.subject.name}
              </h1>
              <p>{subjectView.subject.about}</p>
            </div>
            <div className="grid grid-flow-row grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
              {resourceCards()}
            </div>
            <DeleteModal
              target={`[${subjectView.subject.name}] and everything within it`}
              isOpen={deleteModalOpen}
              onClose={() => setDeleteModalOpen(false)}
              onConfirmed={async () => {
                await deleteMutation.mutateAsync(subjectView.subject.name);
                await router.push("/vault");
              }}
            />
            <EditSubjectModal
              subjectName={subjectView.subject.name}
              subjectAbout={subjectView.subject.about}
              isOpen={editSubjectModalOpen}
              onClose={() => setSubjectModalOpen(false)}
            />
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

// TODO: This should use react query since it's done on the dynamic side.
export const getServerSideProps = getAuthServerSideProps();
