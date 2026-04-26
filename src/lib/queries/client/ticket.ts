"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateTicketFormValues } from "@/lib/zod/ticket";

export type TicketRow = {
  id: number;
  title: string;
  description: string | null;
  tag: "bug" | "feature" | "improvement";
  assignedTo: string;
  assigneeName: string;
  assigneeEmail: string;
  createdBy: string;
  createdAt: string;
  closedAt: string | null;
};

export type OrgMember = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
};

export const ticketQueryKeys = {
  all: (orgId: string) => ["tickets", orgId] as const,
  memberSearch: (orgId: string, q: string) =>
    ["org-members-search", orgId, q] as const,
};

export function useTicketsQuery(orgId: string) {
  return useQuery<TicketRow[]>({
    queryKey: ticketQueryKeys.all(orgId),
    queryFn: async () => {
      const res = await fetch(`/api/organization/${orgId}/tickets`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch tickets");
      const data = await res.json();
      return data.tickets;
    },
    enabled: Boolean(orgId),
  });
}

export function useOrgMemberSearch(orgId: string, query: string) {
  return useQuery<OrgMember[]>({
    queryKey: ticketQueryKeys.memberSearch(orgId, query),
    queryFn: async ({ signal }) => {
      const res = await fetch(
        `/api/organization/${orgId}/members/search?q=${encodeURIComponent(query)}`,
        { signal },
      );
      if (!res.ok) throw new Error("Failed to search members");
      return res.json();
    },
    enabled: Boolean(orgId) && query.trim().length >= 2,
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
}

export function useCreateTicket(orgId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: Omit<CreateTicketFormValues, "organizationId">) => {
      const res = await fetch(`/api/organization/${orgId}/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create ticket");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ticketQueryKeys.all(orgId),
      });
    },
  });
}
