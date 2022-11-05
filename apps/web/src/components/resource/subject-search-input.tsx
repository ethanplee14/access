import LoadingDisplay from "../common/loading-display";
import {
  BookOpenIcon,
  CursorArrowRippleIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { roundRange } from "../../utils/math";
import SubjectModal from "./subject-modal";

export interface SubjectSearchInputProps {
  value?: string;
  subjectNameIdMap?: Record<string, string>;
  loading?: boolean;
  onChange?: (subject: string) => void;
}

export default function SubjectSearchInput(props: SubjectSearchInputProps) {
  const [filteredSelections, setFilteredSelections] = useState<string[]>([]);
  const [activeSelection, setActiveSelection] = useState(-1);
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);

  const subjectNames = props.subjectNameIdMap
    ? Object.keys(props.subjectNameIdMap)
    : [];

  useEffect(() => {
    setFilteredSelections(
      props.subjectNameIdMap ? Object.keys(props.subjectNameIdMap) : []
    );
  }, [props.subjectNameIdMap]);

  return (
    <>
      <div className="dropdown">
        <label className="input-group">
          <span>{<BookOpenIcon className={"w-5"} />}</span>
          <input
            type="text"
            tabIndex={0}
            className="input input-bordered w-full"
            placeholder={"Search..."}
            onKeyDown={keyDownHandler}
            value={props.value}
            onChange={onChangeHandler}
          />
        </label>
        <ul
          tabIndex={0}
          className="absolute mt-2 p-2 shadow menu menu-compact dropdown-content bg-base-300 rounded-box w-full"
        >
          {props.loading ? (
            <LoadingDisplay />
          ) : filteredSelections.length == 0 ? (
            <li onClick={() => setSubjectModalOpen(true)}>
              <a>
                <CursorArrowRippleIcon className={"w-5"} />
                Can&apos;t find subject! Create new subject?
              </a>
            </li>
          ) : (
            filteredSelections.map((s, i) => (
              <li
                key={"search-" + s}
                onClick={(e) => {
                  props.onChange?.(s);
                  e.currentTarget.parentElement?.blur();
                }}
              >
                <a className={activeSelection == i ? "active" : ""}>{s}</a>
              </li>
            ))
          )}
        </ul>
      </div>
      <SubjectModal
        subjectName={props.value}
        subjectNameIdMap={props.subjectNameIdMap}
        isOpen={subjectModalOpen}
        onClose={() => setSubjectModalOpen(false)}
      />
    </>
  );

  function keyDownHandler(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key == "Enter") {
      props.onChange?.(filteredSelections[activeSelection] ?? "");
      e.currentTarget.blur();
      return;
    }

    let newSelection = activeSelection;
    if (e.key == "ArrowDown") newSelection++;
    else if (e.key == "ArrowUp") newSelection--;

    setActiveSelection(
      roundRange(newSelection, [-1, filteredSelections.length])
    );
  }

  function onChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const newInputVal = e.target.value;
    props.onChange?.(newInputVal);
    const selectionFilter = (s: string) =>
      s.toLowerCase().startsWith(newInputVal.toLowerCase());
    const filteredSelection = subjectNames?.filter(selectionFilter);
    setFilteredSelections(filteredSelection ?? []);
  }
}
