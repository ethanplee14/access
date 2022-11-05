import { Modal, ModalProps } from "../common/modal";
import { trpc } from "../../utils/trpc";
import { LabeledFormControl } from "../labeled-form-control";
import { LinkIcon, PencilIcon, TagIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import SaveButton from "../common/buttons/save-button";
import TagInput from "../resource/tag-input";

export interface EditResourceModalProps extends Omit<ModalProps, "title"> {
  resourceId: string;
  url: string;
  name: string;
  tags: string[];
  subjectId: string;
  onSave?: (url: string, name: string, tags: string[]) => Promise<void> | void;
}

export default function EditResourceModal(props: EditResourceModalProps) {
  const [url, setUrl] = useState(props.url);
  const [name, setName] = useState(props.name);
  const [tags, setTags] = useState(props.tags);

  const subjectQuery = trpc.useQuery(["vault.subject", props.subjectId]);
  const editResourceMutation = trpc.useMutation("vault.resourceViewer.edit");

  subjectQuery?.data;
  return (
    <Modal {...props} boxClass={"overflow-visible"} title={"Edit Resource"}>
      <div className="flex flex-col gap-2">
        <LabeledFormControl label={"URL"}>
          <label className="input-group">
            <span>
              <LinkIcon className={"w-5"} />
            </span>
            <input
              type="text"
              className="input input-sm input-bordered w-full"
              placeholder={"https://example.com"}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </label>
        </LabeledFormControl>
        <LabeledFormControl label={"Name"}>
          <label className="input-group">
            <span>
              <PencilIcon className={"w-5"} />
            </span>
            <input
              type="text"
              className={"input input-sm input-bordered w-full"}
              placeholder={"Name or title of resource"}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
        </LabeledFormControl>
        <LabeledFormControl label={"Tags"} subLabel={"(Comma seperated)"}>
          <TagInput
            initialValue={tags}
            size={"sm"}
            availableTags={subjectQuery.data?.tags.map((t) => t.name) ?? []}
            placeholder={"Tags..."}
            onChange={setTags}
          />
        </LabeledFormControl>
        <SaveButton
          loading={editResourceMutation.isLoading}
          onClick={async (_) => {
            await editResourceMutation.mutateAsync({
              resId: props.resourceId,
              subjectId: props.subjectId,
              url,
              name,
              tags,
            });
            await props.onSave?.(url, name, tags); //set tags here
            props.onClose?.();
          }}
        />
      </div>
    </Modal>
  );
}
