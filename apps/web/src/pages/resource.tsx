import Head from "next/head";
import NavBar from "../components/nav-bar";
import React, { useMemo, useRef, useState } from "react";
import {
  DocumentPlusIcon,
  LinkIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { LabeledFormControl } from "../components/common/labeled-form-control";
import StarVote from "../components/common/inputs/star-vote";
import { trpc } from "../utils/trpc";
import SubjectSearchInput from "../components/resource/subject-search-input";
import TagInput from "../components/resource/tag-input";
import SaveButton from "../components/common/buttons/save-button";
import RichTextarea from "../components/common/textarea/rich-textarea";
import { Descendant } from "slate";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { decodeReadableStream } from "../utils/string";
import classNames from "classnames";

export default function Resource() {
  //TODO:
  // consider putting subjectsQuery in a state management system or context.
  // Currently passing down subjectNameIdMap 2 levels
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File>();
  const [name, setName] = useState("");
  const [subjectName, setSubjectName] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [reviewScore, setReviewScore] = useState(0);
  const reviewComment = useRef<Descendant[]>([]);

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const session = useSession();

  const subjectsQuery = trpc.useQuery(["vault.subject.record"]);
  const resourceMutation = trpc.useMutation(["vault.resource.create"]);

  const subjectNames = useMemo(
    () => Object.keys(subjectsQuery.data ?? {}),
    [subjectsQuery.data]
  );
  const selectedSubject = subjectsQuery.data?.[subjectName];

  const subjectNameIdMap = useMemo(() => {
    const map: Record<string, string> = {};
    Object.entries(subjectsQuery.data ?? {}).forEach(
      ([k, v]) => (map[k] = v.id)
    );
    return map;
  }, [subjectsQuery.data]);

  return (
    <>
      <Head>
        <title>Add resource - Access</title>
        <meta name="description" content="Knowledge Graph" />
        <link rel="icon" href="icons/favicon.ico" />
      </Head>
      <main>
        <NavBar />
        <div className="w-full md:max-w-3xl p-2 mt-4 mx-auto">
          <div className="flex font-mono font-semibold gap-2 text-xl mb-4">
            <DocumentPlusIcon className={"w-6"} />
            <h1>New Resource</h1>
          </div>

          <div className="flex flex-col gap-4">
            {!file && (
              <LabeledFormControl label={"URL"}>
                <label className="input-group">
                  <span>
                    <LinkIcon className={"w-5"} />
                  </span>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder={"https://example.com"}
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </label>
              </LabeledFormControl>
            )}
            <input
              type="file"
              className={classNames("file-input file-input-bordered", {
                "file-input-sm w-1/3 ml-auto": !file,
              })}
              onChange={(e) => {
                const file = e.target.files?.[0];
                setFile(file);
                setName(file?.name ?? "");
              }}
            />
            <LabeledFormControl label={"Name"}>
              <label className="input-group">
                <span>
                  <PencilIcon className={"w-5"} />
                </span>
                <input
                  type="text"
                  className="input input-bordered w-full"
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
                  availableTags={selectedSubject?.tags.map((t) => t.name) ?? []}
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
              className={"btn-md"}
              onClick={async () => {
                setLoading(true);

                await resourceMutation.mutateAsync({
                  url: (await uploadFile()) ?? url,
                  name,
                  subjectName,
                  tags,
                  review: {
                    score: reviewScore,
                    comment: JSON.stringify(reviewComment.current),
                  },
                });
                await router.push("/vault/" + subjectName);
                setLoading(false);
              }}
            />
          </div>
        </div>
      </main>
    </>
  );

  async function uploadFile() {
    if (!file) return;
    if (!session.data?.user?.id)
      throw new Error("There's no user id, something got really messed up");

    const formData = new FormData();
    formData.append("userId", session.data.user.id);
    formData.append("file", file);

    const uploadRes = await fetch("/api/resource", {
      method: "POST",
      body: formData,
    });

    if (!uploadRes.body) {
      throw new Error("Failed to get upload response body");
    }

    return await decodeReadableStream(uploadRes.body);
  }
}
