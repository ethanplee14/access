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
    isRefetching,
  } = trpc.useQuery(["vault.search", "wri"], {
    initialData: { subjects: [], resources: [] },
    refetchOnWindowFocus: false,
    enabled: false,
  });

  const searchEntries = buildSearchEntries();
  console.log(searchStr);

  console.log(searchEntries);

  return (
    <SearchInput
      label={<MagnifyingGlassIcon className="w-5 h-5" />}
      className="input-sm"
      value={searchStr}
      isLoading={isLoading || isRefetching}
      onChange={(e) => {
        setSearchStr(e.target.value);
        refetch().then(console.log);
      }}
    />
  );

  function buildSearchEntries() {
    if (!searchData) return [];

    const results: (readonly string[])[] = [];

    searchData["subjects"].forEach((s) =>
      results.push([s, "SUBJECT"] as const)
    );
    searchData["resources"].forEach((r) =>
      results.push([r, "RESOURCE"] as const)
    );

    return results;
  }
}
