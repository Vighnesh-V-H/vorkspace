import { db } from "@/db";
import { organization, organizationMember } from "@/db/schema/organization";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getMembershipById } from "@/lib/queries/organization";

export default async function OrganizationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const organizationId = resolvedParams.id;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  const membership = await getMembershipById(organizationId, session.user.id);

  if (!membership || membership.length === 0) {
    redirect("/dashboard");
  }

  const org = membership[0].organization;

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
