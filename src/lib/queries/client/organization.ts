"use client";

import type { Organization } from "@/db/schema";
import { useQuery } from "@tanstack/react-query";

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
  console.log(data);
  if (!data) throw new Error("Organization not found");

  return data;
}

export const organizationQueryKeys = {
  all: ["organizations"] as const,
  detail: (id: string) => ["organizations", id] as const,
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
