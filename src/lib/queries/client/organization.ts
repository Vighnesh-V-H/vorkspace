"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

export type Organization = {
  id: string;
  name: string;
  email?: string | null;
};

type OrganizationsResponse = {
  success: boolean;
  organizations: Organization[];
};

type OrganizationResponse = {
  success: boolean;
  organization: Organization;
};

async function fetchOrganizations(): Promise<Organization[]> {
  const response = await fetch("/api/organization", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch organizations");
  }

  const data = (await response.json()) as OrganizationsResponse;

  if (!data.success || !Array.isArray(data.organizations)) {
    throw new Error("Invalid organizations response");
  }

  return data.organizations;
}

async function fetchOrganizationById(orgId: string): Promise<Organization> {
  const response = await fetch(`/api/organization/${orgId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch organization");
  }

  const data = (await response.json()) as OrganizationResponse;

  if (!data.success || !data.organization) {
    throw new Error("Invalid organization response");
  }

  return data.organization;
}

export const organizationQueryKeys = {
  all: ["organizations"] as const,
  detail: (orgId: string) => ["organizations", orgId] as const,
};

export function useOrganizationsQuery(
  options?: Omit<
    UseQueryOptions<
      Organization[],
      Error,
      Organization[],
      readonly ["organizations"]
    >,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: organizationQueryKeys.all,
    queryFn: fetchOrganizations,
    ...options,
  });
}

export function useOrganizationByIdQuery(
  orgId: string | undefined,
  options?: Omit<
    UseQueryOptions<
      Organization,
      Error,
      Organization,
      ReturnType<typeof organizationQueryKeys.detail>
    >,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: organizationQueryKeys.detail(orgId ?? ""),
    queryFn: () => fetchOrganizationById(orgId as string),
    enabled: Boolean(orgId),
    ...options,
  });
}
