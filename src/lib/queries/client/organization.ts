"use client";

import type { Organization } from "@/db/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

async function fetchOrganizations(): Promise<Organization[]> {
  const res = await fetch("/api/organization", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch organizations");

  const data = await res.json();

  if (!Array.isArray(data.organizations)) {
    throw new Error("Invalid organizations response");
  }

  return data.organizations;
}

async function fetchOrganizationById(id: string): Promise<Organization> {
  const res = await fetch(`/api/organization/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch organization");

  const data = await res.json();
  console.log("data", data);
  if (!data) throw new Error("Organization not found");

  return data;
}

async function updateOrganization({ id, name }: { id: string; name: string }) {
  const res = await fetch(`/api/organization/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to update organization");
  return res.json();
}

async function deleteOrganization(id: string) {
  const res = await fetch(`/api/organization/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete organization");
  return res.json();
}

async function fetchOrganizationMembers(id: string) {
  const res = await fetch(`/api/organization/${id}/members`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch organization members");
  return res.json();
}

export const organizationQueryKeys = {
  all: ["organizations"] as const,
  detail: (id: string) => ["organizations", id] as const,
  members: (id: string) => ["organizations", id, "members"] as const,
};

export function useOrganizationsQuery(options = {}) {
  return useQuery({
    queryKey: organizationQueryKeys.all,
    queryFn: fetchOrganizations,
    ...options,
  });
}

export function useOrganizationByIdQuery(orgId: string, options = {}) {
  return useQuery({
    queryKey: organizationQueryKeys.detail(orgId),
    queryFn: () => fetchOrganizationById(orgId),
    enabled: Boolean(orgId),
    ...options,
  });
}

export function useOrganizationMembersQuery(orgId: string, options = {}) {
  return useQuery({
    queryKey: organizationQueryKeys.members(orgId),
    queryFn: () => fetchOrganizationMembers(orgId),
    enabled: Boolean(orgId),
    ...options,
  });
}

export function useUpdateOrganizationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateOrganization,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: organizationQueryKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: organizationQueryKeys.all });
    },
  });
}

export function useDeleteOrganizationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationQueryKeys.all });
    },
  });
}
