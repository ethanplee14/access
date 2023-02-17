import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  DocumentPlusIcon,
  LinkIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { trpc } from "./utils/trpc";
import { LabeledFormControl } from "./components/labeled-form-control";
import StarVote from "./components/common/inputs/star-vote";
import SubjectSearchInput from "./components/resource/subject-search-input";
import TagInput from "./components/resource/tag-input";
import SaveButton from "./components/common/buttons/save-button";
import RichTextarea from "./components/common/textarea/rich-textarea";
import { Descendant } from "slate";

export default function Resource() {
  //TODO:
  // consider putting subjectsQuery in a state management system or context.
  // Currently passing down subjectNameIdMap 2 levels
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [subjectName, setSubjectName] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [reviewScore, setReviewScore] = useState(0);
  const reviewComment = useRef<Descendant[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      setUrl(tabs[0]?.url ?? "");
      setName(tabs[0]?.title ?? "");
    });
  }, []);

  const subjectsQuery = trpc.useQuery(["vault.subject.record"]);
  const resourceMutation = trpc.useMutation(["vault.resource.create"]);

  const subjectNames = useMemo(
    //not sure why react-query data returns a json key/value. Might have to do with AppRouter being type any.
    () => Object.keys(subjectsQuery.data ?? {}),
    [subjectsQuery.data]
  );
  const selectedSubject = subjectsQuery.data?.[subjectName];

  const subjectNameIdMap = useMemo(() => {
    const map: Record<string, string> = {};
    Object.entries(subjectsQuery.data ?? {}).forEach(
      ([k, v]: any) => (map[k] = v.id)
    );
    return map;
  }, [subjectsQuery.data]);

  return (
    <>
      <main className="w-96 px-2 overflow-y-auto">
        <div className="w-full md:max-w-3xl p-2 mt-4 mx-auto">
          <div className="flex font-mono font-semibold gap-2 text-xl mb-4">
            <DocumentPlusIcon className={"w-4"} />
            <h1 className="text-md">New Resource</h1>
          </div>

          <div className="flex flex-col gap-4">
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
                  className="input input-sm input-bordered w-full"
                  placeholder={"Name or title of resource"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
            </LabeledFormControl>
            <LabeledFormControl label={"Subject"}>
              <SubjectSearchInput
                value={subjectName}
                loading={subjectsQuery.isLoading}
                subjectNameIdMap={subjectNameIdMap}
                onChange={setSubjectName}
              />
            </LabeledFormControl>
            {subjectNames?.includes(subjectName) && (
              <LabeledFormControl label={"Tags"} subLabel={"(Comma seperated)"}>
                <TagInput
                  availableTags={
                    selectedSubject?.tags.map((t: any) => t.name) ?? []
                  }
                  onChange={setTags}
                />
              </LabeledFormControl>
            )}

            <LabeledFormControl label={"Your review"} subLabel={"(Optional)"}>
              <div className="flex flex-col gap-2">
                <StarVote value={reviewScore} onChange={setReviewScore} />
                <RichTextarea
                  onChange={(val) => (reviewComment.current = val)}
                />
              </div>
            </LabeledFormControl>

            <SaveButton
              loading={loading}
              className={"btn-sm"}
              onClick={async () => {
                setLoading(true);
                await resourceMutation.mutateAsync({
                  url,
                  name,
                  subjectName,
                  tags,
                  review: {
                    score: reviewScore,
                    comment: JSON.stringify(reviewComment.current),
                  },
                });
                setLoading(false);
              }}
            />
          </div>
        </div>
      </main>
    </>
  );
}
