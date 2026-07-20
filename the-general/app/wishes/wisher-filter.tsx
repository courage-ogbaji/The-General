"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function WisherFilter({
  wishers,
}: {
  wishers: { id: string; displayName: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("author") ?? "all";

  return (
    <Select
      value={current}
      onValueChange={(value) => {
        const params = new URLSearchParams(searchParams);
        if (!value || value === "all") {
          params.delete("author");
        } else {
          params.set("author", String(value));
        }
        const query = params.toString();
        router.push(query ? `/wishes?${query}` : "/wishes");
      }}
    >
      <SelectTrigger className="w-full sm:w-56">
        <SelectValue placeholder="Filter by wisher">
          {(value: string | null) =>
            !value || value === "all"
              ? "Everyone"
              : (wishers.find((w) => w.id === value)?.displayName ?? "Everyone")
          }
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Everyone</SelectItem>
        {wishers.map((wisher) => (
          <SelectItem key={wisher.id} value={wisher.id}>
            {wisher.displayName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
