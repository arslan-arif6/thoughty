import { useMemo } from "react";
import { ThoughtType } from "@/types/thought";
import { useThoughtsContext } from "@/context/ThoughtsContext";

export function useThoughts() {
  return useThoughtsContext();
}

export function useThought(id?: string | string[]) {
  const { thoughts } = useThoughtsContext();
  const thoughtId = Array.isArray(id) ? id[0] : id;
  return useMemo(() => thoughts.find((thought) => thought.id === thoughtId) ?? null, [thoughtId, thoughts]);
}

export function useTypedThoughts(type: ThoughtType) {
  const { thoughts } = useThoughtsContext();
  return useMemo(() => thoughts.filter((thought) => thought.type === type && thought.status !== "archived"), [thoughts, type]);
}

export function useSearchResults(query: string, filter: ThoughtType | "all" | "archived") {
  const { thoughts } = useThoughtsContext();
  return useMemo(() => {
    const needle = query.trim().toLowerCase();
    return thoughts.filter((thought) => {
      const matchesFilter = filter === "all" || (filter === "archived" ? thought.status === "archived" : thought.type === filter && thought.status !== "archived");
      const matchesQuery = !needle || thought.content.toLowerCase().includes(needle) || thought.type.includes(needle);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query, thoughts]);
}
