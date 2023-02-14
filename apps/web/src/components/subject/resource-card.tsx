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
    "card w-full h-50 shadow-lg border border-gray-200",
    className
  );
  const iconBtnStyle = "btn btn-ghost btn-square btn-xs hover:text-neutral";
  const resourceURL = new URL(resource.url);

  return (
    <div className={cardStyle}>
      {resource.meta.image && (
        <div className="h-36 relative">
          <Image
            src={resource.meta.image}
            alt={resource.name}
            layout="fill"
            objectFit="cover"
          />
        </div>
      )}

      <div className="card-body h-full overflow-auto py-2 px-4 gap-0">
        <div className="text-sm mb-2">
          <Link href={`/vault/${subjectName.toLowerCase()}/${resource.id}`}>
            <a className={"font-semibold hover:underline"} title={resource.url}>
              {resource.name || resource.meta.title}{" "}
            </a>
          </Link>
          <Link href={resource.url}>
            <a
              target="_blank"
              className="text-xs text-gray-500 hover:underline"
            >
              ({resourceURL.hostname})
            </a>
          </Link>
        </div>
        <TagsBar />
        <p className={"text-xs py-4"}>{resource.meta.description}</p>
        <div className={"text-gray-500 gap-2 text-right"}>
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
