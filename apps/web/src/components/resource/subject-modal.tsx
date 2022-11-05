import { Modal, ModalProps } from "../common/modal";
import { LabeledFormControl } from "../labeled-form-control";
import SaveButton from "../common/buttons/save-button";
import React, { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import { LimitedTextarea } from "../common/textarea/limited-textarea";

export interface SubjectModalProps extends Omit<ModalProps, "title"> {
  subjectName?: string;
  subjectNameIdMap?: Record<string, string>;
}

export default function SubjectModal(props: SubjectModalProps) {
  const [name, setName] = useState(props.subjectName ?? "");
  const [about, setAbout] = useState("");

  const utils = trpc.useContext();
  useEffect(() => setName(props.subjectName ?? ""), [props.subjectName]);

  const createSubjectMutation = trpc.useMutation(["vault.createSubject"]);

  return (
    <Modal title={"New Subject"} {...props}>
      <div className="flex flex-col gap-4">
        <LabeledFormControl label={"Subject Name"}>
          <input
            type="text"
            className="input input-sm input-bordered"
            placeholder={"New subject name..."}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </LabeledFormControl>
        <LabeledFormControl label={"About"}>
          <LimitedTextarea
            limit={230}
            rows={3}
            className={"textarea-bordered"}
            placeholder={"What's the subject about?"}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
        </LabeledFormControl>
        <SaveButton
          label={"Create"}
          className={"btn-sm"}
          loading={createSubjectMutation.isLoading}
          onClick={async (_) => {
            const nameIdMap = props.subjectNameIdMap;
            if (nameIdMap == undefined) return;
            const subjectData = { name, about };
            await createSubjectMutation.mutateAsync(subjectData);
            await utils.invalidateQueries(["vault.subjectRecord"]);
            reset();
            props.onClose?.();
          }}
        />
      </div>
    </Modal>
  );

  function reset() {
    setName("");
    setAbout("");
  }
}
