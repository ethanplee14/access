import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import SearchInput from "./common/inputs/search-input";

export interface GraphSearchProps {
  selections?: string[];
  onSelect?: (selection: string) => void;
}

export default function GraphSearch(props: GraphSearchProps) {
  const [opened, setOpened] = useState(false);
  const [selection, setSelection] = useState("");

  return (
    <div>
      {opened ? (
        <button
          className="btn btn-circle btn-sm btn-ghost"
          onClick={() => setOpened(!opened)}
        >
          <MagnifyingGlassIcon className="w-5 h-5" />
        </button>
      ) : (
        <div className="input-group">
          <SearchInput
            value={selection}
            className="input-sm"
            selections={props.selections}
            placeholder="Search subject..."
            onSelect={(selection) => {
              setSelection(selection);
              props.onSelect?.(selection);
            }}
            onChange={(e) => setSelection(e.target.value)}
          />
          <button
            className="btn btn-circle btn-sm"
            onClick={() => setOpened(!opened)}
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
