import {
  ArrowTopRightOnSquareIcon,
  DocumentTextIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import classNames from "classnames";
import { useRouter } from "next/router";
import DeleteModal from "../common/modals/delete-modal";
import { useState } from "react";
import { Metadata } from "../../server/scripts/meta-fetcher";
import Image from "next/image";

export interface ResourceCardProps {
  subjectName: string;
  resource: {
    url: string;
    name: string;
    id: string;
    tags: { id: string; name: string }[];
  } & { meta: Metadata };
  className?: string;
}

export default function ResourceCard({
  subjectName,
  resource,
  className,
}: ResourceCardProps) {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const cardStyle = classNames(
    "card w-full h-96 shadow-lg border border-gray-200",
    className
  );
  const iconBtnStyle = "btn btn-ghost btn-square btn-xs hover:text-neutral";

  return (
    <div className={cardStyle}>
      {resource.meta.image && (
        <figure className={"hidden sm:flex max-h-36 overflow-hidden"}>
          <Image src={resource.meta.image} alt={resource.name} />
        </figure>
      )}

      <div className="card-body h-full overflow-auto py-2 px-4 gap-0">
        <div className="card-title">
          <Link href={resource.url}>
            <a
              target={"_blank"}
              className={"hover:underline"}
              title={resource.url}
            >
              {resource.name || resource.meta.title}{" "}
              <ArrowTopRightOnSquareIcon className={"w-3 inline-block mb-1"} />
            </a>
          </Link>
        </div>
        <TagsBar />
        <p className={"text-sm py-4"}>{resource.meta.description}</p>
        <div className={"flex text-gray-500 gap-2"}>
          <div className="tooltip z-50" data-tip="Overview">
            <button
              className={iconBtnStyle}
              onClick={() =>
                router.push(
                  `/vault/${subjectName.toLowerCase()}/${resource.id}`
                )
              }
            >
              <DocumentTextIcon className={"w-5"} />
            </button>
          </div>
          <div className="tooltip tooltip-error" data-tip={"Delete"}>
            <button
              className={iconBtnStyle + " hover:bg-error"}
              onClick={() => setDeleteModalOpen(true)}
            >
              <TrashIcon className={"w-5"} />
            </button>
          </div>
        </div>
      </div>
      <DeleteModal
        target={resource.name}
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  );

  function TagsBar() {
    const tags = resource.tags.map((t, i) => (
      <span
        key={`${resource.id}-${t.id}-${i}`}
        className="badge badge-xs overflow-visible"
      >
        {t.name}
      </span>
    ));
    return <div className={"flex flex-wrap gap-1"}>{tags}</div>;
  }
}
