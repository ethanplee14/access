import { ChangeEvent, TextareaHTMLAttributes, useState } from "react";
import { commaSeparate } from "../../../utils/string";

type extendedTextAreaProps = "placeholder";

export interface TagTextareaProps
  extends Pick<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    extendedTextAreaProps
  > {
  onChange?: (tags: string[]) => void;
}

export default function TagTextarea(props: TagTextareaProps) {
  const [text, setText] = useState("");

  return (
    <>
      <textarea
        className={
          "textarea leading-5 bg-white border border-3 border-gray-300"
        }
        placeholder={props.placeholder}
        value={text}
        onChange={changeHandler}
      />
      <div className="mt-2 flex-1 flex flex-wrap gap-1">
        {buildTags(commaSeparate(text))}
      </div>
    </>
  );

  function changeHandler(e: ChangeEvent<HTMLTextAreaElement>) {
    const text = e.target.value;
    setText(text);
    props.onChange?.(commaSeparate(text));
  }

  function buildTags(tags: string[]) {
    return tags.map((t, i) => (
      <span key={`${t}-${i}`} className={"badge badge-sm"}>
        {t}
      </span>
    ));
  }
}
