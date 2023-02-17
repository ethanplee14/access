import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useMemo, useState } from "react";
import { trpc } from "../../utils/trpc";
import SearchInput from "../common/inputs/search-input";

export default function VaultSearch() {
  const router = useRouter();
  const [searchStr, setSearchStr] = useState("");

  const {
    data: searchData,
    refetch,
    isLoading,
    isRefetching,
  } = trpc.useQuery(["vault.search", searchStr], {
    initialData: { subjects: [], resources: [] },
    refetchOnWindowFocus: false,
    enabled: Boolean(searchStr),
  });

  const searchSelections = useMemo(buildSearchSelections, [searchData]);

  useEffect(() => {
    if (!searchStr) return;
    refetch();
    // should put a cooldown timer here. I guess the official term is debounce. Some callback methods but can probably work with setTimeout as well.
  }, [searchStr]);
  return (
    <SearchInput
      label={<MagnifyingGlassIcon className="w-5 h-5" />}
      placeholder="Search vault..."
      className="input-sm"
      value={searchStr}
      isLoading={isLoading || isRefetching}
      onChange={(e) => setSearchStr(e.target.value)}
      selections={searchSelections}
      onSelect={(i) => router.push(searchSelections[i]?.props["href"])}
    />
  );

  function buildSearchSelections() {
    if (!searchData) return [];

    const entries: ReactElement[] = [];

    searchData["subjects"].forEach((s) =>
      entries.push(
        <Link href={`/vault/${s.toLowerCase()}`}>
          <span>
            {s} <span className="text-gray-500 text-xs">(Subject)</span>
          </span>
        </Link>
      )
    );
    searchData["resources"].forEach((r) => {
      entries.push(
        <Link href={`/vault/${r.subjectName.toLowerCase()}/${r.id}`}>
          <span>
            {r.name} <span className="text-gray-400 text-xs">(Resource)</span>
          </span>
        </Link>
      );
    });
    return entries;
  }
}
