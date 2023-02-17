import {
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import classNames from "classnames";
import { ReactNode, useState } from "react";
import { roundRange } from "../../../utils/math";

export interface SearchInputProps {
  value?: string;
  selections?: ReactNode[];
  label?: ReactNode;
  emptyDisplay?: ReactNode;
  className?: string;
  isLoading?: boolean;
  autofocus?: boolean;
  placeholder?: string;
  activeSelection?: number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onSelect?: (selectIndex: number) => void;
}

export default function SearchInput(props: SearchInputProps) {
  const [activeSelection, setActiveSelection] = useState(
    props.activeSelection ?? 0
  );

  const inputComp = (
    <input
      type="text"
      tabIndex={0}
      className={classNames("input input-bordered w-full", props.className)}
      placeholder={props.placeholder || "Search..."}
      onKeyDown={keyDownHandler}
      value={props.value}
      autoFocus={props.autofocus}
      onChange={(e) => {
        setActiveSelection(0);
        props.onChange?.(e);
      }}
    />
  );

  return (
    <div className="dropdown w-full">
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
        className="absolute mt-2 p-2 shadow menu menu-compact dropdown-content bg-base-300 rounded-lg  w-full max-h-48 overflow-y-auto flex-nowrap"
      >
        {renderDropdown()}
      </ul>
    </div>
  );

  function renderDropdown() {
    if (props.isLoading) {
      return <button className="btn btn-sm btn-ghost loading" />;
    }
    if (props.value?.length == 0) {
      return (
        <li className="">
          <a>
            <InformationCircleIcon className={"w-5"} />
            <div className="flex-1">Type to search</div>
          </a>
        </li>
      );
    }
    if (!props.selections || props.selections.length == 0)
      return (
        <li>
          <a>
            <XCircleIcon className="w-5 h-5" />
            <div className="flex-1">No results matched your search.</div>
          </a>
        </li>
      );
    return props.selections?.map((s, i) => (
      <li
        key={"search-" + i}
        className="w-full"
        onClick={(e) => {
          e.currentTarget?.parentElement?.blur();
          props.onSelect?.(i);
        }}
      >
        <a className={activeSelection == i ? "active" : ""}>{s}</a>
      </li>
    ));
  }

  function keyDownHandler(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key == "Enter") {
      props.onSelect?.(activeSelection);
      e.currentTarget.blur();
      return;
    }

    let newSelection = activeSelection;
    if (e.key == "ArrowDown") newSelection++;
    else if (e.key == "ArrowUp") newSelection--;

    setActiveSelection(
      roundRange(newSelection, [-1, props.selections?.length ?? 0])
    );
  }
}
