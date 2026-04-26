"use client";

import { useParams, useRouter } from "next/navigation";
import { useOrganizationByIdQuery } from "@/lib/queries/client/organization";
import Loader from "@/components/ui/loader";

export default function OrganizationPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const { data: org, isLoading, error } = useOrganizationByIdQuery(id);

  console.log("org",org);

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-5xl">
        <Loader />
      </div>
    );
  }

  if (error || !org) {
    router.push("/dashboard");
    return (
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-5xl">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{org.name}</h1>
        {org.email && <p className="text-muted-foreground mt-1">{org.email}</p>}
      </div>

      <div className="p-8 border rounded-xl bg-card shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Organization Details</h2>
        <p className="text-muted-foreground">
          Welcome to the {org.name} organization dashboard. You can manage
          organization settings and members here.
        </p>
      </div>
    </div>
  );
}
