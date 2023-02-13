import {
  ArrowTopRightOnSquareIcon,
  EllipsisVerticalIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { VaultResource, VaultTag } from "@prisma/client";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { Descendant } from "slate";
import { Metadata } from "../../server/scripts/meta-fetcher";
import { trpc } from "../../utils/trpc";
import StarVote from "../common/inputs/star-vote";
import DeleteModal from "../common/modals/delete-modal";
import RichTextarea from "../common/textarea/rich-textarea";
import NavBar from "../nav-bar";
import EditResourceModal from "./edit-resource-modal";

export interface VaultResourceViewerProps {
  subjectName: string;
  resource: VaultResource & { tags: VaultTag[] } & { meta: Metadata };
}

export default function VaultResourceViewer({
  subjectName,
  resource,
}: VaultResourceViewerProps) {
  const router = useRouter();

  const trpcCtx = trpc.useContext();
  const scoreMutation = trpc.useMutation("vault.resource.updateScore");
  const reviewMutation = trpc.useMutation("vault.resource.updateReview");
  const deleteMutation = trpc.useMutation("vault.resource.delete");

  const editorRef = useRef<HTMLDivElement>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(false);
  const [editResourceModalOpen, setEditResourceModalOpen] = useState(false);
  const [review, setReview] = useState<Descendant[]>(
    resource.review && JSON.parse(resource.review).length > 0
      ? JSON.parse(resource.review)
      : [{ type: "p", children: [{ text: "Click to add description." }] }]
  );

  return (
    <>
      <Head>
        <title>{`${resource.name} - Access`}</title>
        <meta name="description" content={"Resource viewer"} />
        <link rel="icon" href="/icons/favicon.ico" />
      </Head>
      <main>
        <NavBar />
        <div className="container mx-auto p-6">
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
              <li onClick={() => setEditResourceModalOpen(true)}>
                <a>
                  <PencilSquareIcon className={"w-5"} /> Edit
                </a>
              </li>
              <li onClick={() => setDeleteModalOpen(true)}>
                <a>
                  <TrashIcon className={"w-5"} /> Delete
                </a>
              </li>
            </ul>
          </div>

          <Link href={resource.url}>
            <a
              className={"text-sm text-gray-400 gap-1 hover:underline"}
              target={"_blank"}
            >
              {resource.url}
              <ArrowTopRightOnSquareIcon className={"w-3 inline-block ml-1"} />
            </a>
          </Link>
          <div className={"mb-4"}>
            <h1 className="flex-1 text-3xl font-mono font-semibold">
              {resource.name}
            </h1>
            <div className="flex gap-1 mb-1">
              {resource.tags.map((t) => (
                <span key={`${t.id}`} className={"badge badge-sm"}>
                  {t.name}
                </span>
              ))}
            </div>
            <StarVote
              value={resource.score ?? undefined}
              onChange={async (score) => {
                await scoreMutation.mutateAsync({ resId: resource.id, score });
                await trpcCtx.invalidateQueries("vault.resource.view");
              }}
            />
          </div>
          <div
            ref={editorRef}
            onMouseDown={(_) => {
              if (editingReview) return;

              function disableReviewEdit(e: React.MouseEvent) {
                if (!editorRef.current?.contains(e.target as Node)) {
                  setEditingReview(false);
                  document.removeEventListener(
                    "click",
                    disableReviewEdit as any
                  );
                  // gotta access the set state builder in order to get updated state since the event listener doesn't
                  // exist in the same context as react. React and native DOM event listeners don't play well together....
                  // Really tempting me to hit up SolidJS
                  setReview((rev) => {
                    reviewMutation.mutate({
                      resId: resource.id,
                      review: JSON.stringify(rev),
                    });
                    return rev;
                  });
                }
              }
              setEditingReview(true);
              document.addEventListener("click", disableReviewEdit as any);
            }}
          >
            <RichTextarea
              className={"min-h-[32rem] shadow-lg"}
              readonly={!editingReview}
              initialValue={review}
              onChange={(val) => setReview(val)}
            />
          </div>
        </div>
      </main>
      <DeleteModal
        isOpen={deleteModalOpen}
        target={resource.name}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmed={async () => {
          await deleteMutation.mutateAsync({ resId: resource.id });
          await router.push("/vault/" + subjectName.toLowerCase());
        }}
      />
      <EditResourceModal
        isOpen={editResourceModalOpen}
        resourceId={resource.id}
        url={resource.url}
        name={resource.name}
        tags={resource.tags.map((t) => t.name)}
        subjectId={resource.subjectId}
        onClose={() => setEditResourceModalOpen(false)}
        onSave={async () =>
          await trpcCtx.invalidateQueries([
            "vault.resource.view",
            { resId: resource.id },
          ])
        }
      />
    </>
  );
}
