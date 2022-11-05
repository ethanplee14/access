import { Modal, ModalProps } from "../common/modal";
import { LabeledFormControl } from "../labeled-form-control";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { LimitedTextarea } from "../common/textarea/limited-textarea";
import SaveButton from "../common/buttons/save-button";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";

export interface EditSubjectModalProps extends Omit<ModalProps, "title"> {
  subjectName: string;
  subjectAbout: string;
}

export default function EditSubjectModal(props: EditSubjectModalProps) {
  const router = useRouter();
  const [name, setName] = useState(props.subjectName);
  const [about, setAbout] = useState(props.subjectAbout);

  const editSubjectMutation = trpc.useMutation("vault.editSubject");

  return (
    <Modal {...props} title={"Editing subject - " + props.subjectName}>
      <div className="flex flex-col gap-2">
        <LabeledFormControl label={"Subject name"}>
          <label className="input-group">
            <span>
              <BookOpenIcon className={"w-5"} />
            </span>
            <input
              type="text"
              className="input input-sm input-bordered w-full"
              placeholder={"Subject name..."}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
        </LabeledFormControl>
        <LabeledFormControl label={"Subject about"}>
          <LimitedTextarea
            className={"textarea-bordered"}
            limit={230}
            placeholder={"What's the subject about?"}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
        </LabeledFormControl>
        <SaveButton
          loading={editSubjectMutation.isLoading}
          onClick={async () => {
            await editSubjectMutation.mutateAsync({
              subjectName: props.subjectName,
              newName: name,
              newAbout: about,
            });
            router.push("/vault/" + name.toLowerCase());
            props.onClose?.();
          }}
        />
      </div>
    </Modal>
  );
}
