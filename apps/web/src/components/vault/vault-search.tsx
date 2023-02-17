import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "../../utils/trpc";
import SearchInput from "../common/inputs/search-input";

type SearchType = "SUBJECT" | "RESOURCE";

export default function VaultSearch() {
  const router = useRouter();
  const [searchStr, setSearchStr] = useState("");

  const {
    data: searchData,
    refetch,
    isLoading,
  } = trpc.useQuery(["vault.search", searchStr], {
    initialData: { subjects: [], resources: [] },
    enabled: false,
  });

  return (
    <SearchInput
      label={<MagnifyingGlassIcon className="w-5 h-5" />}
      className="input-sm"
      value={searchStr}
      isLoading={isLoading}
      onChange={(e) => setSearchStr(e.target.value)}
    />
  );

  function flattenResults() {
    if (!searchData) return [];

    const results: string[][] = [];

    searchData["subjects"].forEach((s) => results.push([s, "SUBJECT"]));

    return;
  }
}
