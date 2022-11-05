import React, { ReactNode, useState } from "react";
import { roundRange } from "../../../utils/math";
import classNames from "classnames";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export interface SearchInputProps {
  value?: string;
  selections?: string[];
  label?: ReactNode;
  emptyDisplay?: ReactNode;
  className?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onSelect?: (selection: string) => void;
}

export default function SearchInput(props: SearchInputProps) {
  const [filteredSelections, setFilteredSelections] = useState<string[]>(
    props.selections ?? []
  );
  const [activeSelection, setActiveSelection] = useState(-1);

  const inputComp = (
    <input
      type="text"
      tabIndex={0}
      className={classNames("input input-bordered w-full", props.className)}
      placeholder={"Search..."}
      onKeyDown={keyDownHandler}
      value={props.value}
      onChange={onChangeHandler}
    />
  );

  return (
    <div className="dropdown">
      {props.label ? (
        <div className={"input-group"}>
          <span>{props.label}</span>
          {inputComp}
        </div>
      ) : (
        inputComp
      )}
      <ul
        tabIndex={0}
        className="absolute mt-2 p-2 shadow menu menu-compact dropdown-content bg-base-300 rounded-box w-full"
      >
        {filteredSelections.length == 0 ? (
          <li>
            <a>
              <InformationCircleIcon className={"w-5"} /> No selection found!
            </a>
          </li>
        ) : (
          filteredSelections.map((s, i) => (
            <li
              key={"search-" + s}
              onClick={(e) => {
                e.currentTarget?.parentElement?.blur();
                props.onSelect?.(s);
              }}
            >
              <a className={activeSelection == i ? "active" : ""}>{s}</a>
            </li>
          ))
        )}
      </ul>
    </div>
  );

  function keyDownHandler(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key == "Enter") {
      if (filteredSelections[activeSelection]) {
        props.onSelect?.(filteredSelections[activeSelection]!);
      }
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
    props.onChange?.(e);
    setActiveSelection(0);

    const selectionFilter = (s: string) =>
      s.toLowerCase().startsWith(newInputVal.toLowerCase());
    const filteredSelection = props.selections?.filter(selectionFilter);
    setFilteredSelections(filteredSelection ?? []);
  }
}
