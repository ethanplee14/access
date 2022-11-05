import { Modal, ModalProps } from "../modal";
import { ReactNode, useState } from "react";
import {
  ExclamationCircleIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import AsyncButton from "../buttons/async-button";

export interface DeleteModalProps extends ModalProps {
  target?: string;
  content?: ReactNode;
  onConfirmed?: () => void | Promise<void>;
}

export default function DeleteModal(props: DeleteModalProps) {
  const deleteContent = props.content ?? (
    <p>
      Are you sure you want to delete{" "}
      {props.target ? <strong>{props.target}</strong> : "that"}?
    </p>
  );

  const [loading, setLoading] = useState(false);

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <div className={"flex items-center gap-4"}>
        <ExclamationCircleIcon className={"w-10 h-full label-error"} />
        {deleteContent}
      </div>
      <div className="flex w-full gap-2 mt-4">
        <button
          className="btn flex-1 shadow border-1 border-gray-300"
          onClick={props.onClose}
        >
          <XMarkIcon className={"mr-2 w-4 h-4"} />
          Cancel
        </button>
        <AsyncButton
          loading={loading}
          className="btn btn-error flex-1 shadow"
          onClick={async () => {
            setLoading(true);
            await props.onConfirmed?.();
            setLoading(false);
          }}
        >
          <TrashIcon className={"mr-2 w-4 h-4"} />
          Delete
        </AsyncButton>
      </div>
    </Modal>
  );
}
