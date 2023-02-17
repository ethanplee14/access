import React, { useState } from "react";
import SearchInput, { SearchInputProps } from "./search-input";

export type FilterSearchInputProps = Omit<
  SearchInputProps,
  "selections" | "onSelect"
> & {
  selections?: string[];
  onSelect?: (selection: string) => void;
};

export default function FilterSearchInput(props: FilterSearchInputProps) {
  const [filteredSelections, setFilteredSelections] = useState<string[]>(
    props.selections ?? []
  );

  return (
    <SearchInput
      {...props}
      selections={filteredSelections}
      onChange={onChangeHandler}
      onSelect={(selectIndex) =>
        props.onSelect?.(filteredSelections[selectIndex] ?? "")
      }
    />
  );

  function onChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const newInputVal = e.target.value;
    props.onChange?.(e);

    const selectionFilter = (s: string) =>
      s.toLowerCase().startsWith(newInputVal.toLowerCase());
    const filteredSelection = props.selections?.filter(selectionFilter);
    setFilteredSelections(filteredSelection ?? []);
  }
}
