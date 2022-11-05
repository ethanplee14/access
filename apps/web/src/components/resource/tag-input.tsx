import {
  Bars4Icon,
  InformationCircleIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { commaSeparate } from "../../utils/string";
import classNames from "classnames";

export type TagSize = "sm";

export interface TagInputProps {
  initialValue?: string[];
  availableTags?: string[];
  onChange?: (tags: string[]) => void;
  size?: TagSize;
  placeholder?: string;
}

export default function TagInput(props: TagInputProps) {
  const [value, setValue] = useState(props?.initialValue?.join(", ") ?? "");

  const tags = commaSeparate(value);

  return (
    <>
      <div className="flex gap-2">
        <label className="input-group">
          <span>
            <TagIcon className={"w-5"} />
          </span>
          <input
            type="text"
            tabIndex={0}
            className={classNames("input input-bordered w-full", {
              "input-sm": props.size == "sm",
            })}
            placeholder={props.placeholder ?? "Search..."}
            value={value}
            onChange={changeHandler}
          />
        </label>
        <div className={"dropdown dropdown-end p-0"}>
          <label
            tabIndex={0}
            className={classNames("btn btn-square btn-ghost bg-base-300", {
              "btn-sm": props.size == "sm",
            })}
          >
            <Bars4Icon className={"w-5"} />
          </label>
          <ul
            tabIndex={0}
            className={
              "dropdown-content menu menu-compact p-2 shadow bg-base-100 rounded-box w-52"
            }
          >
            {buildTagSelections()}
          </ul>
        </div>
      </div>
      <div className="mt-2 flex-1 flex flex-wrap gap-1">
        {buildTags(commaSeparate(value))}
      </div>
    </>
  );

  function changeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    setValue(newValue);
    props.onChange?.(commaSeparate(e.target.value));
  }

  function buildTags(tags: string[]) {
    return tags.map((t, i) => {
      const isNewTag = !props.availableTags?.includes(t);

      return (
        <span
          key={`${t}-${i}`}
          className={classNames("badge badge-sm ", {
            "badge-accent": isNewTag,
          })}
        >
          {t}
        </span>
      );
    });
  }

  function buildTagSelections() {
    const unusedTags = props.availableTags?.filter((t) => !tags.includes(t));

    if (unusedTags?.length == 0)
      return (
        <li>
          <a>
            <InformationCircleIcon className={"w-5"} /> No more tags!
          </a>
        </li>
      );

    return unusedTags?.map((t, i) => (
      <li
        key={`${t}-selection-${i}`}
        onClick={() => {
          setValue(value + t + ", ");
          props.onChange?.(commaSeparate(value + t));
        }}
      >
        <a>{t}</a>
      </li>
    ));
  }
}
